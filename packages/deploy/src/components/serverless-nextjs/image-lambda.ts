import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { ICdnBehaviorOptions } from '../cdn';
import { ComponentBaseProps } from './component';
import { LAMBDA_AT_EDGE_RUNTIME } from './constants';

export interface ImageLambdaProps extends ComponentBaseProps {
  /** Path of the directory containing the image lambda handler */
  readonly imageLambdaPath: string;
}

/** Create an image lambda that handles optimization */
export class ImageLambda extends cdk.Construct implements ICdnBehaviorOptions {
  private readonly cachePolicy: cloudfront.CachePolicy;
  private readonly lambda: lambda.Function;
  private readonly originRequestPolicy: cloudfront.OriginRequestPolicy;
  private readonly origin: cloudfront_origins.S3Origin;

  constructor(scope: cdk.Construct, id: string, props: ImageLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.bucket);

    this.lambda = new lambda.Function(this, 'Lambda', {
      runtime: LAMBDA_AT_EDGE_RUNTIME,
      code: lambda.Code.fromAsset(props.imageLambdaPath),
      handler: 'index.handler',
      memorySize: 2048, // Needs a lot of memory or it runs quite slowly.
      timeout: cdk.Duration.seconds(30),
    });
    props.bucket.grantReadWrite(this.lambda);

    this.originRequestPolicy = new cloudfront.OriginRequestPolicy(
      this,
      'OriginRequestPolicy',
      {
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      },
    );

    this.cachePolicy = new cloudfront.CachePolicy(this, 'CachePolicy', {
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.days(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });
  }

  cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return {
      origin: this.origin,
      cachePolicy: this.cachePolicy,
      originRequestPolicy: this.originRequestPolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: this.lambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}
