import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as s3bng from 'cdk-s3bucket-ng';
import * as path from 'path';
import { PACKAGES_BASE } from '../constants';
import { ICdnBehaviorOptions } from './cdn';

/** Creates a bucket website and deploys the static site to it. */
export class StaticSite extends cdk.Construct implements ICdnBehaviorOptions {
  /** The bucket with the website */
  public readonly bucket: s3.Bucket;
  /** The key prefix the site was uploaded into */
  public readonly bucketKeyPrefix?: string;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.bucket = new s3bng.BucketNg(this, 'StaticSite', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
    });
    this.bucket.grantPublicAccess();

    // This will be for when we do blue/green. But that time is not now.
    this.bucketKeyPrefix = undefined;

    new s3_deployment.BucketDeployment(this, 'StaticSiteDeployment', {
      destinationBucket: this.bucket,
      destinationKeyPrefix: this.bucketKeyPrefix,
      prune: true,
      sources: [
        s3_deployment.Source.asset(path.join(PACKAGES_BASE, 'frontend', 'out')),
      ],
    });
  }

  public cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return {
      origin: new cloudfront_origins.S3Origin(this.bucket, {
        originPath: this.bucketKeyPrefix,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    };
  }
}
