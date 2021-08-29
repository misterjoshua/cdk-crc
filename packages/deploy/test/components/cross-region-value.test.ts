import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { CrossRegionValue } from '../../src/components/cross-region-value';

describe('cross-region-value', () => {
  const TEST_VALUE = 'test-value';

  test('same stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const ofString = CrossRegionValue.fromString(
      stack,
      'SomeString',
      TEST_VALUE,
    );

    // WHEN
    const valueInScope = ofString.getValueInScope(stack, 'Value');

    // THEN
    expect(valueInScope).toEqual(TEST_VALUE);
  });

  test('other stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'Stack1', {
      env: { region: 'ca-central-1' },
    });
    const ofString = CrossRegionValue.fromString(
      stack1,
      'SomeString',
      TEST_VALUE,
    );

    const stack2 = new cdk.Stack(app, 'Stack2', {
      env: { region: 'us-east-1' },
    });

    // WHEN
    const valueInStack2 = ofString.getValueInScope(stack2, 'Value');
    new cdk.CfnOutput(stack2, 'CrossRegionValue', {
      value: valueInStack2,
    });

    // THEN
    expect(valueInStack2).toContain('${Token');

    Template.fromStack(stack1).templateMatches({
      Outputs: {
        Stack1SomeString83810764Propvalue: {
          Value: TEST_VALUE,
        },
      },
    });

    Template.fromStack(stack2).hasOutput({
      Value: {
        'Fn::GetAtt': [
          'StackOutputsRcacentral1AtokenSStack1StackOutputs65E602C8',
          'Stack1SomeString83810764Propvalue',
        ],
      },
    });
  });

  test('complex type', () => {
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'Stack1', {
      env: { region: 'ca-central-1' },
    });
    const bucket = new s3.Bucket(stack1, 'Bucket', {
      bucketName: TEST_VALUE,
    });
    const crossRegionBucket = new CrossRegionValue(
      stack1,
      'CrossRegionBucket',
      {
        value: bucket,
        props: {
          bucketName: bucket.bucketName,
        },
        produce: (scope, id, props) =>
          s3.Bucket.fromBucketName(scope, id, props.bucketName),
      },
    );

    const stack2 = new cdk.Stack(app, 'Stack2', {
      env: { region: 'us-east-1' },
    });

    // WHEN
    new cdk.CfnOutput(stack2, 'BucketName', {
      value: crossRegionBucket.getValueInScope(stack2, 'Bucket').bucketName,
    });

    // THEN
    Template.fromStack(stack1).templateMatches({
      Resources: {
        Bucket83908E77: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            BucketName: 'test-value',
          },
          UpdateReplacePolicy: 'Retain',
          DeletionPolicy: 'Retain',
        },
      },
      Outputs: {
        Stack1CrossRegionBucket35EBDF8DPropbucketName: {
          Value: {
            Ref: 'Bucket83908E77',
          },
        },
      },
    });

    Template.fromStack(stack2).hasOutput({
      Value: {
        'Fn::GetAtt': [
          'StackOutputsRcacentral1AtokenSStack1StackOutputs65E602C8',
          'Stack1CrossRegionBucket35EBDF8DPropbucketName',
        ],
      },
    });
  });

  test('stack output reuse', () => {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'Stack1');
    const stack2 = new cdk.Stack(app, 'Stack2');
    const first = CrossRegionValue.fromString(stack1, 'First', 'First Value');
    const second = CrossRegionValue.fromString(
      stack1,
      'Second',
      'Second Value',
    );

    // WHEN
    first.getValueInScope(stack2, 'First');
    second.getValueInScope(stack2, 'Second');

    // THEN
    Template.fromStack(stack2).resourceCountIs(
      'AWS::CloudFormation::CustomResource',
      1,
    );
  });

  test('stack output reuse only when appropriate', () => {
    // GIVEN
    const app = new cdk.App();
    const stack1 = new cdk.Stack(app, 'Stack1');
    const stack2 = new cdk.Stack(app, 'Stack2');
    const stack3 = new cdk.Stack(app, 'Stack3');
    const first = CrossRegionValue.fromString(stack1, 'First', 'First Value');
    const second = CrossRegionValue.fromString(
      stack2,
      'Second',
      'Second Value',
    );

    // WHEN
    first.getValueInScope(stack3, 'First');
    second.getValueInScope(stack3, 'Second');

    // THEN
    Template.fromStack(stack3).resourceCountIs(
      'AWS::CloudFormation::CustomResource',
      2,
    );
  });
});
