#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCrcStage } from './cdk-crc-stage';
import * as constants from './constants';
import { Pipeline } from './pipeline';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Development environment.
new CdkCrcStage(app, 'CdkCrc-Dev', {
  env,
  domainConfig: {
    certificateParameter: constants.DOMAIN_CERT_PARAM,
    domainNames: [`cdk-crc-dev.${constants.DOMAIN_NAME}`],
    hostedZoneIdParameter: constants.DOMAIN_ZONE_ID_PARAM,
  },
});

// Continuous Delivery pipeline (uses CdkCrcStage)
new Pipeline(app, 'CdkCrc-Pipeline', {
  env,
});
