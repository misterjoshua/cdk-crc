import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { RegionalStatefulStack } from '../../src/stacks/regional-stateful-stack';

test('database is unchanged', () => {
  const app = new cdk.App();
  const stack = new RegionalStatefulStack(app, 'Stage');

  const assert = Template.fromStack(stack);
  assert.hasResource('AWS::DynamoDB::Table', {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      KeySchema: [
        {
          AttributeName: 'PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'SK',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'SK',
          AttributeType: 'S',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    },
    UpdateReplacePolicy: 'Delete',
    DeletionPolicy: 'Delete',
  });
});
