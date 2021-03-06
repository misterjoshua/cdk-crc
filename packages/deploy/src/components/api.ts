import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigwv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as api from 'api';
import { ICdnBehaviorOptions } from './cdn';
import {
  CrossRegionStringValueProps,
  CrossRegionValue,
} from './cross-region-value';
import { Database } from './database';

/** Props for `Api` */
export interface ApiProps {
  /** The database for the API */
  readonly database: Database;
}

/** Create an HTTP API */
export class Api extends cdk.Construct implements ICdnBehaviorOptions {
  /** The produced API Gateway */
  public readonly httpApi: apigwv2.HttpApi;

  private httpApiDomainName: CrossRegionValue<
    string,
    CrossRegionStringValueProps
  >;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const visitsHandler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(api.getAssetDir()),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'functions/visits.handler',
      environment: {
        [api.FUNCTION_DATABASE_ENV_NAME]: props.database.table.tableName,
      },
    });

    props.database.table.grantReadWriteData(visitsHandler);

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        maxAge: cdk.Duration.days(10),
      },
    });

    new apigwv2.HttpRoute(this, 'Visits', {
      httpApi: this.httpApi,
      routeKey: apigwv2.HttpRouteKey.with('/api/visits'),
      integration: new apigwv2_integrations.LambdaProxyIntegration({
        handler: visitsHandler,
      }),
    });

    const httpApiDomainName = renderExecuteApiDomain(this.httpApi);
    this.httpApiDomainName = CrossRegionValue.fromString(
      this,
      'HttpApiDomainName',
      httpApiDomainName,
    );
  }

  cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    const httpApiDomainName = this.httpApiDomainName.getValueInScope(
      scope,
      'HttpApiDomainName',
    );

    return {
      origin: new cloudfront_origins.HttpOrigin(httpApiDomainName),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    };
  }
}

/**
 * Renders the execute-api domain name for the http api.
 * @param httpApi
 */
function renderExecuteApiDomain(httpApi: apigwv2.HttpApi) {
  return cdk.Fn.join('', [
    httpApi.httpApiId,
    '.execute-api.',
    cdk.Stack.of(httpApi).region,
    '.amazonaws.com',
  ]);
}
