#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCrcStage } from './cdk-crc-stage';

const app = new cdk.App();

// TODO: change to CdkCrc-Dev
new CdkCrcStage(app, 'CdcCrc-Dev');
