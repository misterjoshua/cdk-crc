import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as s3bng from 'cdk-s3bucket-ng';
import * as path from 'path';
import { PACKAGES_BASE } from '../constants';
import { ICdnBehaviorOptions } from './cdn';
import { CrossRegionValue } from './cross-region-value';

export interface StaticSiteProps {
  readonly bucketKeyPrefix?: string;
}

/** Creates a bucket website and deploys the static site to it. */
export class StaticSite extends cdk.Construct implements ICdnBehaviorOptions {
  /** The bucket with the website */
  public readonly bucket: s3.Bucket;
  /** The key prefix the site was uploaded into */
  public readonly bucketKeyPrefix?: string;

  private crossRegionBucket: CrossRegionValue<s3.IBucket, s3.BucketAttributes>;
  private crossRegionOAI: CrossRegionValue<
    cloudfront.IOriginAccessIdentity,
    { originAccessIdentityName: string }
  >;

  constructor(scope: cdk.Construct, id: string, props: StaticSiteProps = {}) {
    super(scope, id);

    this.bucketKeyPrefix = props.bucketKeyPrefix;

    this.bucket = new s3bng.BucketNg(this, 'StaticSite', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create an OAI in the StaticSite's stack because we don't know if the
    // distribution that picks this up will be in this stack or cross-region.
    // If it's cross-region, we'll have trouble updating the bucket policy
    // at the time that we use the usual cloudfront.S3Origin in the other
    // region. So we bypass that problem by passing the OAI name over to any
    // other stack.
    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [oai.grantPrincipal],
        resources: [
          this.bucket.bucketArn,
          cdk.Fn.join('', [this.bucket.bucketArn, '/*']),
        ],
      }),
    );

    this.crossRegionOAI = new CrossRegionValue(this, 'CrossRegionOAI', {
      value: oai,
      props: {
        originAccessIdentityName: oai.originAccessIdentityName,
      },
      produce: (scope, id, props) =>
        cloudfront.OriginAccessIdentity.fromOriginAccessIdentityName(
          scope,
          id,
          props.originAccessIdentityName,
        ),
    });

    new s3_deployment.BucketDeployment(this, 'StaticSiteDeployment', {
      destinationBucket: this.bucket,
      destinationKeyPrefix: this.bucketKeyPrefix,
      prune: true,
      sources: [
        s3_deployment.Source.asset(path.join(PACKAGES_BASE, 'frontend', 'out')),
      ],
    });

    this.crossRegionBucket = CrossRegionValue.fromS3Bucket(
      this,
      'CrossRegionStaticSitebucket',
      this.bucket,
    );
  }

  public cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    const bucket = this.crossRegionBucket.getValueInScope(scope, 'Bucket');
    const originAccessIdentity = this.crossRegionOAI.getValueInScope(
      scope,
      'OAI',
    );

    return {
      origin: new cloudfront_origins.S3Origin(bucket, {
        originAccessIdentity,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    };
  }
}
