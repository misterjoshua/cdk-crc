/** Domain configuration */
export interface DomainConfig {
  /** SSM parameter name containing the certificate arn. */
  readonly certificateParameter: string;
  /** Domains to serve with this certificate */
  readonly domainNames: string[];
  /** Zone to insert DNS records into */
  readonly hostedZoneIdParameter?: string;
}
