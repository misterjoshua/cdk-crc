import * as cdk from '@aws-cdk/core';
import { DomainConfig } from './components/domain-config';
import { EdgeStack } from './stacks/edge-stack';
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

    // Edge resources
    new EdgeStack(this, 'Edge', {
      domainConfig: props.domainConfig,
      regionalApi: regionalStatelessStack.regionalApi,
    });
  }
}
