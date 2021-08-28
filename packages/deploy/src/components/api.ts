import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigwv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as api from 'api';
import * as crs from 'cdk-remote-stack';
import { ICdnBehaviorOptions } from './cdn';
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

  /** Output name for cross-region references */
  private readonly httpApiDomainNameOutputName: string;

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

    this.httpApiDomainNameOutputName =
      this.uniqueSuffixedId('HttpApiDomainName');
    new cdk.CfnOutput(cdk.Stack.of(this), this.httpApiDomainNameOutputName, {
      value: renderExecuteApiDomain(this.httpApi),
    });
  }

  private uniqueSuffixedId(suffix: string = ''): string {
    return `${cdk.Names.uniqueId(this)}${suffix}`;
  }

  cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions {
    const httpApiDomainName = this.getHttpApiDomainName(scope);

    return {
      origin: new cloudfront_origins.HttpOrigin(httpApiDomainName),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    };
  }

  /** Look up the HTTP API Domain Name */
  public getHttpApiDomainName(scope: cdk.Construct): string {
    const apiStack = cdk.Stack.of(this);
    const scopeStack = cdk.Stack.of(scope);

    if (apiStack === scopeStack) {
      // When the API and given scope are in the same stack, it's safe to use
      // the API's values directly.
      return renderExecuteApiDomain(this.httpApi);
    }

    // But when the API and scope are in different stacks, we have a cross-stack
    // (possibly cross-region) value reference situation. So, in this case, we
    // need to declare a dependency on the api's stack and fetch it via a custom
    // resource.

    scopeStack.addDependency(apiStack);

    // Create or reuse the remote stack outputs resource.
    const stackOutputsId = this.uniqueSuffixedId('StackOutputs');
    const stackOutputs =
      (scope.node.tryFindChild(stackOutputsId) as crs.StackOutputs) ??
      new crs.StackOutputs(scope, stackOutputsId, {
        stack: apiStack,
        alwaysUpdate: true,
      });

    // Access the API's domain name through the remote stack output resource
    // once CloudFormation has created the resource.
    return stackOutputs.getAttString(this.httpApiDomainNameOutputName);
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
