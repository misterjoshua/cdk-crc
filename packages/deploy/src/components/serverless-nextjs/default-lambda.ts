import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { ICdnBehaviorOptions } from '../cdn';
import { ComponentBaseProps } from './component';
import { LAMBDA_AT_EDGE_RUNTIME } from './constants';

export interface DefaultLambdaProps extends ComponentBaseProps {
  readonly defaultLambdaDir: string;
}

export class DefaultLambda
  extends cdk.Construct
  implements ICdnBehaviorOptions
{
  private readonly defaultLambda: lambda.Function;
  private readonly origin: cloudfront_origins.S3Origin;
  private readonly cachePolicy: cloudfront.ICachePolicy;

  constructor(scope: cdk.Construct, id: string, props: DefaultLambdaProps) {
    super(scope, id);

    this.origin = new cloudfront_origins.S3Origin(props.bucket);

    this.defaultLambda = new lambda.Function(this, 'Lambda', {
      runtime: LAMBDA_AT_EDGE_RUNTIME,
      code: lambda.Code.fromAsset(props.defaultLambdaDir),
      handler: 'index.handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });
    props.bucket.grantReadWrite(this.defaultLambda);

    this.cachePolicy = cloudfront.CachePolicy.CACHING_DISABLED;
  }

  cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return {
      origin: this.origin,
      cachePolicy: this.cachePolicy,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          functionVersion: this.defaultLambda.currentVersion,
          includeBody: true,
        },
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          functionVersion: this.defaultLambda.currentVersion,
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
    };
  }
}
