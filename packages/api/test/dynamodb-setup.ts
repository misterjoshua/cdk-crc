import * as AWS from 'aws-sdk';

const TEST_TABLE_NAME = 'TEST_TABLE';

export function getDynamoDB(): AWS.DynamoDB {
  return new AWS.DynamoDB({
    endpoint: 'http://localhost:4566',
    region: 'us-east-1',
    credentials: new AWS.Credentials({
      accessKeyId: 'fake',
      secretAccessKey: 'fake',
    }),
  });
}

export async function setupTable(dynamoDB: AWS.DynamoDB) {
  try {
    // This will throw if the table oes not exist.
    await dynamoDB
      .describeTable({
        TableName: TEST_TABLE_NAME,
      })
      .promise();

    await dynamoDB
      .deleteTable({
        TableName: TEST_TABLE_NAME,
      })
      .promise();

    while (true) {
      // It'll throw when it's done.
      await dynamoDB
        .describeTable({
          TableName: TEST_TABLE_NAME,
        })
        .promise();
    }

    // NOTREACHED
  } catch {
    // Do nothing. This is actually the expected case.
  }

  await dynamoDB
    .createTable({
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {
          KeyType: 'HASH',
          AttributeName: 'PK',
        },
        {
          KeyType: 'RANGE',
          AttributeName: 'SK',
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
      TableName: TEST_TABLE_NAME,
    })
    .promise();

  return TEST_TABLE_NAME;
}
