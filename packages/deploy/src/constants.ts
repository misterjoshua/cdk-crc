import * as path from 'path';

/** Base directory for the 'packages' directory. */
export const PACKAGES_BASE = path.join(__dirname, '..', '..');

// Change the following for your pipeline:

/** The ID part of the ARN for the CodePipeline connection to the repository */
export const PIPELINE_CONNECTION_ID = '42ae9e77-996d-4371-a5ab-22a03487e51d';
/** The repository on the connection */
export const PIPELINE_REPO = 'misterjoshua/cdk-crc';
/** Branch to source for what to build and deploy */
export const PIPELINE_REPO_BRANCH = 'main';

/** Domain name */
export const DOMAIN_NAME = 'kellendonk.ca';
/** SSM parameter containing the arn for an acm cert in us-east-1 */
export const DOMAIN_CERT_PARAM = `/${DOMAIN_NAME}/certificate-arn`;
/** Hosted zone id for the domain */
export const DOMAIN_ZONE_ID_PARAM = `/${DOMAIN_NAME}/hosted-zone-id`;
