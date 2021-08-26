import * as cdk from '@aws-cdk/core';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from '@aws-cdk/pipelines';
import { CdkCrcStage } from './cdk-crc-stage';

export class Pipeline extends cdk.Stack {
  constructor(app: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(app, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('misterjoshua/cdk-crc', 'main'),
        commands: ['npm i -g yarn', 'yarn', 'yarn run build'],
        primaryOutputDirectory: 'packages/deploy/cdk.out',
      }),

      // Allow the pipeline to self-update from git.
      selfMutation: true,

      // Docker is used throughout synths.
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
    });

    pipeline.addStage(new CdkCrcStage(this, 'CdkCrc-Test'));
  }
}
