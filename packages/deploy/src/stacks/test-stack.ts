import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as iv from '@wheatstalk/cdk-intrinsic-validator';
import * as path from 'path';
import { PACKAGES_BASE } from '../constants';

export interface TestStackProps extends cdk.StackProps {
  readonly mainDomain: string;
}

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const baseUrl = cdk.Fn.join('', ['https://', props.mainDomain, '/']);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    // Create a task definition
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'TaskDefinition',
      {
        // Puppeteer runs better with more resources. It won't be running long.
        cpu: 4096,
        memoryLimitMiB: 8192,
      },
    );

    // Add our container to the task definition
    taskDefinition.addContainer('main', {
      // Let's test with a jest & puppeteer rig from the examples directory.
      image: ecs.ContainerImage.fromAsset(path.join(PACKAGES_BASE, 'ftest')),
      environment: {
        // This environment variable configures the test rig not to launch
        // Puppeteer/Chromium in a sandbox. If we aren't specific about this,
        // Puppeteer needs CAP_SYS_ADMIN, which Fargate does not support.
        NO_SANDBOX: 'true',
        // Point the tests to the right place.
        BASE_URL: baseUrl,
      },
      // We supply a command that runs jest to orchestrate Puppeteer.
      command: ['yarn', 'test', '--verbose'],
      // The full test log is too long to show in the CloudFormation output,
      // so if we are interested in seeing why the tests failed, we need to
      // log the container output somewhere.
      logging: ecs.LogDriver.awsLogs({ streamPrefix: '/' }),
    });

    new iv.IntrinsicValidator(this, 'IntrinsicValidator', {
      stateMachineName: `${this.stackName}-IntrinsicValidator`,
      validations: [
        iv.Validation.fargateTaskSucceeds({
          taskDefinition,
          cluster,
          assignPublicIp: true,
        }),
      ],
    });
  }
}
