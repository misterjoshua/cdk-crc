import { StringParameter } from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from '@aws-cdk/pipelines';
import { CdkCrcStage } from './cdk-crc-stage';
import {
  DOMAIN_CERT_PARAM,
  DOMAIN_NAME,
  DOMAIN_ZONE_ID_PARAM,
  PIPELINE_CONNECTION_ARN_PARAM,
  PIPELINE_REPO,
  PIPELINE_REPO_BRANCH,
} from './constants';

/**
 * Create a CDK Pipeline from github to production.
 */
export class Pipeline extends cdk.Stack {
  constructor(app: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(app, id, props);

    // Fetch the Pipeline Connection ARN from SSM
    const pipelineConnectionArnParam = StringParameter.fromStringParameterName(
      this,
      'PipelineConnectionArnParameter',
      PIPELINE_CONNECTION_ARN_PARAM,
    );

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          PIPELINE_REPO,
          PIPELINE_REPO_BRANCH,
          {
            connectionArn: pipelineConnectionArnParam.stringValue,
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

    const testStage = new CdkCrcStage(this, 'CdkCrc-Test', {
      env: {
        account: this.account,
        region: this.region,
      },
      domainConfig: {
        certificateParameter: DOMAIN_CERT_PARAM,
        domainNames: [`cdk-crc-test.${DOMAIN_NAME}`],
        hostedZoneIdParameter: DOMAIN_ZONE_ID_PARAM,
      },
    });

    const prodStage = new CdkCrcStage(this, 'CdkCrc-Production', {
      env: {
        account: this.account,
        region: this.region,
      },
      domainConfig: {
        certificateParameter: DOMAIN_CERT_PARAM,
        domainNames: [`www.${DOMAIN_NAME}`, DOMAIN_NAME],
        hostedZoneIdParameter: DOMAIN_ZONE_ID_PARAM,
      },
    });

    pipeline.addStage(testStage);
    pipeline.addStage(prodStage, {
      // pre: [
      //   new ManualApprovalStep('Promote to Production', {
      //     comment: `Go to https://cdk-crc-test.${DOMAIN_NAME}/ to test the site.`,
      //   }),
      // ],
    });
  }
}
