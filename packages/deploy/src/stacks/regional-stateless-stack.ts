import * as cdk from '@aws-cdk/core';
import { Api } from '../components/api';
import { Database } from '../components/database';
import { StaticSite } from '../components/static-site';

interface RegionalStatelessStackProps extends cdk.StackProps {
  readonly database: Database;
}

/** A regional stack containing stateless workloads */
export class RegionalStatelessStack extends cdk.Stack {
  public readonly regionalApi: Api;
  public readonly staticSite: StaticSite;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: RegionalStatelessStackProps,
  ) {
    super(scope, id, props);

    this.regionalApi = new Api(this, 'Api', {
      database: props.database,
    });

    // Deploy the static site
    this.staticSite = new StaticSite(this, 'StaticSite');
  }
}
