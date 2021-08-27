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

/**
 * Create a CDK Pipeline from github to production.
 */
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
        installCommands: ['bash pipeline-setup.sh'],
        commands: ['yarn build'],
        primaryOutputDirectory: 'packages/deploy/cdk.out',
      }),

      // Allow the pipeline to self-update from git.
      selfMutation: true,

      // Docker is used throughout.
      dockerEnabledForSynth: true,
      dockerEnabledForSelfMutation: true,
    });

    pipeline.addStage(new CdkCrcStage(this, 'CdkCrc-Test'));
  }
}
