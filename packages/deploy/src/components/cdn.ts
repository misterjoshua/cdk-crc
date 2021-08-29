import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { DomainConfig } from './domain-config';

/** Props for `Cdn` */
export interface CdnProps {
  /** Default behavior */
  readonly defaultBehavior: ICdnBehaviorOptions;

  /** Optional domain configuration */
  readonly domainConfig?: DomainConfig;

  /** Behaviors to add */
  readonly behaviors?: AddCdnBehaviorOptions[];
}

/** Options when adding cdn behaviors */
export interface AddCdnBehaviorOptions {
  /** Path of the behavior */
  readonly path: string;
  /** The behavior options provider */
  readonly cdnBehaviorOptions: ICdnBehaviorOptions;
}

/** Behavior options provider */
export interface ICdnBehaviorOptions {
  /** Provide behavior options */
  cdnBehaviorOptions(scope: cdk.Construct): cloudfront.BehaviorOptions;
}

/** Create a CloudFront distribution exposing the static site and the API */
export class Cdn extends cdk.Construct {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: cdk.Construct, id: string, props: CdnProps) {
    super(scope, id);

    const domainNameConfigs = this.renderDistributionDomainConfig(
      props.domainConfig,
    );

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: props.defaultBehavior.cdnBehaviorOptions(this),
      defaultRootObject: 'index.html',

      // Reduce the cost
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

      // Configure the certificate & domain names if available.
      ...domainNameConfigs,
    });

    // Connect the CDN to the API

    for (const behavior of props.behaviors ?? []) {
      this.addBehavior(behavior);
    }
  }

  /** Add a behavior to the CDN */
  public addBehavior(behavior: AddCdnBehaviorOptions) {
    const behaviorOptions =
      behavior.cdnBehaviorOptions.cdnBehaviorOptions(this);
    this.distribution.addBehavior(
      behavior.path,
      behaviorOptions.origin,
      behaviorOptions,
    );
  }

  private renderDistributionDomainConfig(domainConfig?: DomainConfig) {
    if (!domainConfig) {
      return {};
    }

    const certificateArnParameter = ssm.StringParameter.fromStringParameterName(
      this,
      'CertificateArn',
      domainConfig.certificateParameter,
    );
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      certificateArnParameter.stringValue,
    );

    return {
      certificate,
      domainNames: domainConfig?.domainNames,
    };
  }
}
