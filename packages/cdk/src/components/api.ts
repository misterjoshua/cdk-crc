import {Database} from "./database";
import * as cdk from "@aws-cdk/core";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2";
import * as lambda_python from "@aws-cdk/aws-lambda-python";
import * as path from "path";
import {PACKAGES_BASE} from "../constants";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigwv2_integrations from "@aws-cdk/aws-apigatewayv2-integrations";

interface ApiProps {
  readonly database: Database;
}

export class Api extends cdk.Construct {
  public readonly httpApi: apigwv2.HttpApi;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const handler = new lambda_python.PythonFunction(this, 'Handler', {
      entry: path.join(PACKAGES_BASE, 'api'),
      handler: 'hello',
      runtime: lambda.Runtime.PYTHON_3_8,
    });

    props.database.table.grantReadWriteData(handler);

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      defaultIntegration: new apigwv2_integrations.LambdaProxyIntegration({
        handler,
      }),
    });
  }
}