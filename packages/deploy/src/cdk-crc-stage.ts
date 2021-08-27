import * as cdk from '@aws-cdk/core';
import { Api } from './components/api';
import { Cdn } from './components/cdn';
import { Database } from './components/database';
import { Dns } from './components/dns';
import { DomainConfig } from './components/domain-config';
import { StaticSite } from './components/static-site';

/**
 * Props for `CdkCrcStage`
 */
export interface CdkCrcStageProps extends cdk.StageProps {
  /** Optional domain configuration. */
  readonly domainConfig?: DomainConfig;
}

/**
 * A CRC deployment stage with all resources for the environment.
 */
export class CdkCrcStage extends cdk.Stage {
  /** Stack containing the stateful resources */
  public readonly statefulStack: cdk.Stack;
  /** Stack containing the stateless resources */
  public readonly statelessStack: cdk.Stack;

  constructor(scope: cdk.Construct, id: string, props: CdkCrcStageProps = {}) {
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
      domainConfig: props.domainConfig,
    });
    // Configure DNS
    const dns = new Dns(this.statelessStack, 'Dns', {
      cdn,
      domainConfig: props.domainConfig,
    });

    // Show me things about the system.
    new cdk.CfnOutput(this.statelessStack, 'DistributionId', {
      value: cdn.distribution.distributionId,
    });
    new cdk.CfnOutput(this.statelessStack, 'HomeLink', {
      value: cdk.Fn.join('', ['https://', dns.mainDomain, '/']),
    });
    new cdk.CfnOutput(this.statelessStack, 'ApiLink', {
      value: cdk.Fn.join('', ['https://', dns.mainDomain, '/api/hits']),
    });
  }
}
