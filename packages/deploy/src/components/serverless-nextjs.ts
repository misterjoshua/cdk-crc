import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as s3bng from 'cdk-s3bucket-ng';
import * as fs from 'fs';
import * as path from 'path';
import { PACKAGES_BASE } from '../constants';
import { ICdnBehaviorOptions } from './cdn';

/** Props for `ServerlessNextjs` */
export interface ServerlessNextjsProps {
  /** Base directory of the built lambdas */
  readonly lambdaBaseDir?: string;
}

/** Deploy Nextjs as lambdas */
export class ServerlessNextjs
  extends cdk.Construct
  implements ICdnBehaviorOptions
{
  private readonly lambdaBaseDir: string;
  private readonly defaultBehaviorOptions: cloudfront.BehaviorOptions;
  private readonly lambdaAtEdgeRole: iam.Role;
  private readonly assetsBehaviorOptions: cloudfront.AddBehaviorOptions;
  private readonly imageBehaviorOptions?: cloudfront.AddBehaviorOptions;

  private readonly bucket: s3.Bucket;
  private readonly assetCachePolicy: cloudfront.CachePolicy;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: ServerlessNextjsProps = {},
  ) {
    super(scope, id);

    this.lambdaBaseDir =
      props.lambdaBaseDir ?? path.join(PACKAGES_BASE, 'frontend', 'out-lambda');

    this.bucket = new s3bng.BucketNg(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.lambdaAtEdgeRole = this.createLambdaAtEdgeRole();
    this.assetsBehaviorOptions = this.createAssetsBehaviorOptions();
    this.defaultBehaviorOptions = this.createDefaultBehaviorOptions();
    this.imageBehaviorOptions = this.createImageBehaviorOptions();
  }

  private createLambdaAtEdgeRole() {
    // @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html#lambda-edge-permissions-function-execution
    return new iam.Role(this, 'EdgeRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com'),
      ),
      managedPolicies: [AWS_LAMBDA_BASIC_EXECUTION_ROLE],
    });
  }

  private createDefaultBehaviorOptions(): cloudfront.BehaviorOptions {
    const defaultLambda = new lambda.Function(this, 'DefaultLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(this.lambdaBaseDir, 'default-lambda'),
      ),
      timeout: cdk.Duration.seconds(30),
      role: this.lambdaAtEdgeRole,
    });

    this.bucket.grantReadWrite(defaultLambda);

    return {
      origin: new cloudfront_origins.S3Origin(this.bucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      compress: true,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: defaultLambda.currentVersion,
          includeBody: true,
        },
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          functionVersion: defaultLambda.currentVersion,
        },
      ],
    };
  }

  private createAssetsBehaviorOptions() {
    new s3_deployment.BucketDeployment(this, 'AssetsDeployment', {
      destinationBucket: this.bucket,
      sources: [
        s3_deployment.Source.asset(path.join(this.lambdaBaseDir, 'assets')),
      ],
    });

    const cachePolicy = new cloudfront.CachePolicy(this, 'FileCache', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      defaultTtl: cdk.Duration.days(30),
      maxTtl: cdk.Duration.days(30),
      minTtl: cdk.Duration.days(30),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    return {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy,
      compress: true,
    };
  }

  private createImageBehaviorOptions() {
    const imageLambdaPath = path.join(this.lambdaBaseDir, 'image-lambda');

    if (!fs.existsSync(imageLambdaPath)) {
      return;
    }

    const imageLambda = new lambda.Function(this, 'ImageLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(imageLambdaPath),
      timeout: cdk.Duration.seconds(30),
      role: this.lambdaAtEdgeRole,
    });

    const imageOriginRequestPolicy = new cloudfront.OriginRequestPolicy(
      this,
      'ImageOriginRequestPolicy',
      {
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      },
    );

    return {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      cachePolicy: this.assetCachePolicy,
      compress: true,
      originRequestPolicy: imageOriginRequestPolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: imageLambda.currentVersion,
        },
      ],
    };
  }

  public addBehaviors(distribution: cloudfront.Distribution) {
    if (this.imageBehaviorOptions) {
      distribution.addBehavior(
        '_next/image*',
        new cloudfront_origins.S3Origin(this.bucket),
        this.imageBehaviorOptions,
      );
    }

    distribution.addBehavior(
      '_next/*',
      new cloudfront_origins.S3Origin(this.bucket),
      this.assetsBehaviorOptions,
    );
  }

  public cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return this.defaultBehaviorOptions;
  }
}

const AWS_LAMBDA_BASIC_EXECUTION_ROLE =
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    'service-role/AWSLambdaBasicExecutionRole',
  );
