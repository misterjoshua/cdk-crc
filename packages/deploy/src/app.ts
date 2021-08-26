#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCrcStage } from './cdk-crc-stage';
import { Pipeline } from './pipeline';

const app = new cdk.App();

// Development environment.
new CdkCrcStage(app, 'CdkCrc-Dev');

// Continuous Delivery pipeline
new Pipeline(app, 'CdkCrc-Pipeline');
