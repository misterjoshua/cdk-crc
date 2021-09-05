import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as s3bng from 'cdk-s3bucket-ng';
import * as fs from 'fs';
import * as path from 'path';
import { AddCdnBehaviorOptions, ICdnBehaviorOptions } from '../cdn';
import { AssetsDeployment } from './assets-deployment';
import { DefaultLambda } from './default-lambda';
import { ImageLambda } from './image-lambda';
import { StaticAssets } from './static-assets';

export interface ServerlessNextjsProps {
  /**
   * Base directory of the built lambdas
   * @see https://www.npmjs.com/package/@sls-next/lambda-at-edge
   */
  readonly lambdaBaseDir: string;
}

/**
 * Deploy Next.js as Lambda @ Edge.
 * @see https://github.com/serverless-nextjs/serverless-next.js#architecture
 */
export class ServerlessNextjs
  extends cdk.Construct
  implements ICdnBehaviorOptions
{
  private readonly lambdaBaseDir: string;
  private readonly bucket: s3.Bucket;
  private readonly defaultLambda: DefaultLambda;
  private readonly imageLambda?: ImageLambda;
  private readonly bucketAssets: StaticAssets;

  constructor(scope: cdk.Construct, id: string, props: ServerlessNextjsProps) {
    super(scope, id);

    this.lambdaBaseDir = props.lambdaBaseDir;
    this.bucket = new s3bng.BucketNg(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new AssetsDeployment(this, 'AssetsDeployment', {
      bucket: this.bucket,
      assetsDir: path.join(this.lambdaBaseDir, 'assets'),
    });

    this.defaultLambda = new DefaultLambda(this, 'Default', {
      bucket: this.bucket,
      defaultLambdaDir: path.join(this.lambdaBaseDir, 'default-lambda'),
    });

    this.bucketAssets = new StaticAssets(this, 'BucketAssets', {
      bucket: this.bucket,
    });

    const imageLambdaPath = this.getOutputPath('image-lambda');
    if (imageLambdaPath) {
      this.imageLambda = new ImageLambda(this, 'ImageLambda', {
        bucket: this.bucket,
        imageLambdaPath,
      });
    }
  }

  private getOutputPath(outputPath: string) {
    const fullOutputPath = path.join(this.lambdaBaseDir, outputPath);
    return fs.existsSync(fullOutputPath) ? fullOutputPath : undefined;
  }

  /** Provides the default lambda as the default behavior. */
  public cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return this.defaultLambda.cdnBehaviorOptions(scope);
  }

  /** Provides all the rest of the CDN behaviors */
  public cdnAdditionalBehaviorOptions(): AddCdnBehaviorOptions[] {
    const addCdnBehaviorOptions = new Array<AddCdnBehaviorOptions>();

    if (this.imageLambda) {
      addCdnBehaviorOptions.push({
        path: '_next/image*',
        cdnBehaviorOptions: this.imageLambda,
      });
    }

    addCdnBehaviorOptions.push(
      {
        path: '_next/*',
        cdnBehaviorOptions: this.bucketAssets,
      },
      {
        path: 'static/*',
        cdnBehaviorOptions: this.bucketAssets,
      },
    );

    return addCdnBehaviorOptions;
  }
}
