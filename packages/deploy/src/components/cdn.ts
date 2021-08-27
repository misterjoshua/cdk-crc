import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as cloudfront_origins from '@aws-cdk/aws-cloudfront-origins';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Api } from './api';
import { DomainConfig } from './domain-config';
import { StaticSite } from './static-site';

/** Props for `Cdn` */
export interface CdnProps {
  /** The API */
  readonly api: Api;
  /** The static site */
  readonly staticSite: StaticSite;

  /** Optional domain configuration */
  readonly domainConfig?: DomainConfig;
}

/** Create a CloudFront distribution exposing the static site and the API */
export class Cdn extends cdk.Construct {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: cdk.Construct, id: string, props: CdnProps) {
    super(scope, id);

    const { staticSite, api, domainConfig } = props;

    const domainNameConfigs = this.getDomainNameConfigs(domainConfig);

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      // Connect the CDN to the static site bucket
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(staticSite.bucket, {
          originPath: staticSite.bucketKeyPrefix,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },

      // Reduce the cost
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

      // Configure the certificate & domain names if available.
      ...domainNameConfigs,
    });

    // Connect the CDN to the API
    const httpApiDomainName = cdk.Fn.join('', [
      api.httpApi.httpApiId,
      '.execute-api.',
      cdk.Stack.of(this).region,
      '.amazonaws.com',
    ]);

    this.distribution.addBehavior(
      '/api/*',
      new cloudfront_origins.HttpOrigin(httpApiDomainName),
      {
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },
    );
  }

  private getDomainNameConfigs(domainConfig?: DomainConfig) {
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
