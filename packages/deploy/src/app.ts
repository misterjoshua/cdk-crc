#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { CdkCrcStage } from './cdk-crc-stage';

const app = new cdk.App();

new CdkCrcStage(app, 'CdkCrc-Dev');
