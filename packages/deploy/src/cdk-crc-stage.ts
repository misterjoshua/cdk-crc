import * as cdk from '@aws-cdk/core';
import { Cdn } from './components/cdn';
import { Dns } from './components/dns';
import { DomainConfig } from './components/domain-config';
import { ServerlessNextjs } from './components/serverless-nextjs';
import { RegionalStatefulStack } from './stacks/regional-stateful-stack';
import { RegionalStatelessStack } from './stacks/regional-stateless-stack';

/**
 * Props for `CdkCrcStage`
 */
export interface CdkCrcStageProps extends cdk.StageProps {
  /** Optional domain configuration. */
  readonly domainConfig?: DomainConfig;
}

/**
 * A CRC deployment stage with all resources for the environment.
 */
export class CdkCrcStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props: CdkCrcStageProps = {}) {
    super(scope, id, props);

    const stageEnv = {
      account: this.account,
      region: this.region,
    };

    // Stateful resources:
    const regionalStatefulStack = new RegionalStatefulStack(
      this,
      'RegionalStateful',
      { env: stageEnv },
    );

    // Stateless resources:
    const regionalStatelessStack = new RegionalStatelessStack(
      this,
      'RegionalStateless',
      {
        env: stageEnv,
        database: regionalStatefulStack.database,
      },
    );

    // Edge/L@E resources in us-east-1
    const edge = new cdk.Stack(this, 'Edge', {
      env: { region: 'us-east-1' },
    });

    const serverlessNextJs = new ServerlessNextjs(edge, 'Nextjs');

    // Front the static site and api with a CDN
    const cdn = new Cdn(edge, 'Cdn', {
      domainConfig: props.domainConfig,
      defaultBehavior: serverlessNextJs,
      behaviors: [
        {
          path: '/api/*',
          cdnBehaviorOptions: regionalStatelessStack.regionalApi,
        },
      ],
    });

    // Configure DNS
    new Dns(edge, 'Dns', {
      cdn: cdn,
      domainConfig: props.domainConfig,
    });
  }
}
