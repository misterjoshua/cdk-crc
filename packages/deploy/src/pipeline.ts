import * as cdk from '@aws-cdk/core';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from '@aws-cdk/pipelines';
import { CdkCrcStage } from './cdk-crc-stage';
import {
  PIPELINE_CONNECTION_ID,
  PIPELINE_REPO,
  PIPELINE_REPO_BRANCH,
} from './constants';

export class Pipeline extends cdk.Stack {
  constructor(app: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(app, id, props);

    const connectionArn = `arn:aws:codestar-connections:${this.region}:${this.account}:connection/${PIPELINE_CONNECTION_ID}`;

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          PIPELINE_REPO,
          PIPELINE_REPO_BRANCH,
          {
            connectionArn,
          },
        ),
        commands: ['npm i -g yarn', 'yarn', 'yarn run build'],
        primaryOutputDirectory: 'packages/deploy/cdk.out',
      }),

      // Allow the pipeline to self-update from git.
      selfMutation: false,

      // Docker is used throughout.
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
    });

    pipeline.addStage(new CdkCrcStage(this, 'CdkCrc-Test'));
  }
}
