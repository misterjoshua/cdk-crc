import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { CdkCrcStage } from '../src/cdk-crc-stage';

test('database is unchanged', () => {
  const app = new cdk.App();
  const stage = new CdkCrcStage(app, 'Stage');

  const assert = Template.fromStack(stage.statefulStack);
  assert.templateMatches({
    Resources: {
      DatabaseTableF104A135: {
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
      },
    },
    Outputs: {
      ExportsOutputFnGetAttDatabaseTableF104A135ArnDAC15A6A: {
        Value: {
          'Fn::GetAtt': ['DatabaseTableF104A135', 'Arn'],
        },
        Export: {
          Name: 'Stage-Stateful:StatefulExportsOutputFnGetAttDatabaseTableF104A135ArnE91FEB90',
        },
      },
    },
  });
});
