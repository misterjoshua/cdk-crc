import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3_deployment from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { PACKAGES_BASE } from '../constants';
import { ICdnBehaviorOptions } from './cdn';

export class ServerlessNextjs
  extends cdk.Construct
  implements ICdnBehaviorOptions
{
  public readonly defaultLambda: lambda.Function;
  public readonly bucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket');

    const lambdaBase = path.join(PACKAGES_BASE, 'frontend', 'out-lambda');

    new s3_deployment.BucketDeployment(this, 'AssetsDeployment', {
      destinationBucket: this.bucket,
      sources: [s3_deployment.Source.asset(path.join(lambdaBase, 'assets'))],
    });

    // @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html#lambda-edge-permissions-function-execution
    const lambdaAtEdgeRole = new iam.Role(this, 'EdgeRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com'),
      ),
      managedPolicies: [AWS_LAMBDA_BASIC_EXECUTION_ROLE],
    });

    this.defaultLambda = new lambda.Function(this, 'DefaultLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(lambdaBase, 'default-lambda')),
      role: lambdaAtEdgeRole,
    });
    this.bucket.grantReadWrite(this.defaultLambda);
  }

  public cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    return {
      origin: new cloudfront_origins.S3Origin(this.bucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      compress: true,
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
    };
  }
}

const AWS_LAMBDA_BASIC_EXECUTION_ROLE =
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    'service-role/AWSLambdaBasicExecutionRole',
  );
