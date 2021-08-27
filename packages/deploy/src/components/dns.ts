import * as r53 from '@aws-cdk/aws-route53';
import * as r53_targets from '@aws-cdk/aws-route53-targets';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Cdn } from './cdn';
import { DomainConfig } from './domain-config';

/** Props for `Dns` */
export interface DnsRecordsProps {
  readonly cdn: Cdn;
  readonly domainConfig?: DomainConfig;
}

/** DNS configuration */
export class Dns extends cdk.Construct {
  /** Main domain for web traffic */
  public readonly mainDomain: string;

  constructor(scope: cdk.Construct, id: string, props: DnsRecordsProps) {
    super(scope, id);

    const { cdn, domainConfig } = props;

    if (
      domainConfig &&
      domainConfig.hostedZoneIdParameter &&
      domainConfig.domainNames.length > 0
    ) {
      this.mainDomain = domainConfig.domainNames[0];

      const hostedZoneIdParameter = ssm.StringParameter.fromStringParameterName(
        this,
        'HostedZoneIdParameter',
        domainConfig.hostedZoneIdParameter,
      );

      const { zoneName } = parseDomain(this.mainDomain);
      const zone = r53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
        hostedZoneId: hostedZoneIdParameter.stringValue,
        zoneName,
      });

      for (const domainName of domainConfig.domainNames) {
        const recordProps = {
          zone,
          recordName: domainName,
          target: r53.RecordTarget.fromAlias(
            new r53_targets.CloudFrontTarget(cdn.distribution),
          ),
        };

        new r53.ARecord(this, `A_${domainName}`, recordProps);
        new r53.AaaaRecord(this, `AAAA_${domainName}`, recordProps);
      }
    } else {
      this.mainDomain = cdn.distribution.distributionDomainName;
    }
  }
}

export function parseDomain(fqdn: string) {
  const matches = fqdn.match(/^(.*)\.(.*\..*)$/);

  if (!matches) {
    throw new Error('Could not split the given domain');
  }

  return {
    recordName: matches[1],
    zoneName: matches[2],
  };
}
