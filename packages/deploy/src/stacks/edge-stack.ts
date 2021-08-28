import * as cdk from '@aws-cdk/core';
import { Api } from '../components/api';
import { Cdn } from '../components/cdn';
import { Dns } from '../components/dns';
import { DomainConfig } from '../components/domain-config';
import { StaticSite } from '../components/static-site';

interface EdgeStackProps extends cdk.StackProps {
  readonly domainConfig?: DomainConfig;
  readonly regionalApi: Api;
  readonly regionalStaticSite: StaticSite;
}

/** Creates a stack for resources in us-east-1 */
export class EdgeStack extends cdk.Stack {
  public readonly cdn: Cdn;

  constructor(scope: cdk.Construct, id: string, props: EdgeStackProps) {
    super(scope, id, {
      ...props,
      env: { region: 'us-east-1' },
    });

    // Deploy the static site
    const staticSite = new StaticSite(this, 'StaticSite');

    // Front the static site and api with a CDN
    this.cdn = new Cdn(this, 'Cdn', {
      domainConfig: props.domainConfig,
      defaultBehavior: staticSite,
      behaviors: [{ path: '/api/*', cdnBehaviorOptions: props.regionalApi }],
    });

    // Configure DNS
    const dns = new Dns(this, 'Dns', {
      cdn: this.cdn,
      domainConfig: props.domainConfig,
    });

    // API Domain Name:
    new cdk.CfnOutput(this, 'ApiDomainName', {
      value: props.regionalApi.getHttpApiDomainName(this),
    });

    // Show me things about the system.
    new cdk.CfnOutput(this, 'HomeLink', {
      value: cdk.Fn.join('', ['https://', dns.mainDomain, '/']),
    });

    new cdk.CfnOutput(this, 'ApiLink', {
      value: cdk.Fn.join('', ['https://', dns.mainDomain, '/api/hits']),
    });
  }
}
