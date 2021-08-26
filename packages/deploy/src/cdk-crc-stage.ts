import * as cdk from '@aws-cdk/core';
import { Api } from './components/api';
import { Cdn } from './components/cdn';
import { Database } from './components/database';
import { StaticSite } from './components/static-site';

export class CdkCrcStage extends cdk.Stage {
  public readonly statefulStack: cdk.Stack;
  public readonly statelessStack: cdk.Stack;

  constructor(scope: cdk.Construct, id: string, props: cdk.StageProps = {}) {
    super(scope, id, props);

    // Stateful resources:
    this.statefulStack = new cdk.Stack(this, 'Stateful');
    const database = new Database(this.statefulStack, 'Database');

    // Stateless resources:
    this.statelessStack = new cdk.Stack(this, 'Stateless');
    // Deploy the static site
    const staticSite = new StaticSite(this.statelessStack, 'StaticSite');
    // Deploy the api
    const api = new Api(this.statelessStack, 'Api', {
      database,
    });
    // Front the static site and api with a CDN
    const cdn = new Cdn(this.statelessStack, 'Cdn', {
      api,
      staticSite,
    });

    // Show me things about the system.
    new cdk.CfnOutput(this.statelessStack, 'DistributionId', {
      value: cdn.distribution.distributionId,
    });
    new cdk.CfnOutput(this.statelessStack, 'HomeLink', {
      value: cdk.Fn.join('', [
        'https://',
        cdn.distribution.distributionDomainName,
        '/',
      ]),
    });
    new cdk.CfnOutput(this.statelessStack, 'ApiLink', {
      value: cdk.Fn.join('', [
        'https://',
        cdn.distribution.distributionDomainName,
        '/api/something',
      ]),
    });
  }
}
