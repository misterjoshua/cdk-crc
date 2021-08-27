import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigwv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as api from 'api';
import { Database } from './database';

/** Props for `Api` */
export interface ApiProps {
  /** The database for the API */
  readonly database: Database;
}

/** Create an HTTP API */
export class Api extends cdk.Construct {
  /** The produced API Gateway */
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const hitsHandler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(api.getAssetDir()),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'functions/hits.handler',
      environment: {
        [api.FUNCTION_DATABASE_ENV_NAME]: props.database.table.tableName,
      },
    });

    props.database.table.grantReadWriteData(hitsHandler);

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        maxAge: cdk.Duration.days(10),
      },
    });

    new apigwv2.HttpRoute(this, 'Hits', {
      httpApi: this.httpApi,
      routeKey: apigwv2.HttpRouteKey.with('/api/hits'),
      integration: new apigwv2_integrations.LambdaProxyIntegration({
        handler: hitsHandler,
      }),
    });
  }
}
