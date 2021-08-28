import * as cdk from '@aws-cdk/core';
import { Api } from '../components/api';
import { Database } from '../components/database';

interface RegionalStatelessStackProps extends cdk.StackProps {
  readonly database: Database;
}

export class RegionalStatelessStack extends cdk.Stack {
  public readonly regionalApi: Api;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: RegionalStatelessStackProps,
  ) {
    super(scope, id, props);

    this.regionalApi = new Api(this, 'Api', {
      database: props.database,
    });
  }
}
