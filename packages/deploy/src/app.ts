#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCrcStage } from './cdk-crc-stage';
import {
  DOMAIN_CERT_PARAM,
  DOMAIN_NAME,
  DOMAIN_ZONE_ID_PARAM,
} from './constants';
import { Pipeline } from './pipeline';

const app = new cdk.App();

// Development environment.
new CdkCrcStage(app, 'CdkCrc-Dev', {
  domainConfig: {
    certificateParameter: DOMAIN_CERT_PARAM,
    domainNames: [`cdk-crc-dev.${DOMAIN_NAME}`],
    hostedZoneIdParameter: DOMAIN_ZONE_ID_PARAM,
  },
});

// Continuous Delivery pipeline
new Pipeline(app, 'CdkCrc-Pipeline');
