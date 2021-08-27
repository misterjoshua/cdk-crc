import * as AWS from 'aws-sdk';

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

export async function initTable(dynamoDB: AWS.DynamoDB, tableName: string) {
  async function hasTable(tableName: string) {
    const listTablesResponse = await dynamoDB.listTables().promise();
    return !!listTablesResponse.TableNames?.some((t) => t === tableName);
  }

  if (await hasTable(tableName)) {
    await dynamoDB
      .deleteTable({
        TableName: tableName,
      })
      .promise();

    for (let times = 0; times < 100; times++) {
      if (!(await hasTable(tableName))) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
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
      TableName: tableName,
    })
    .promise();

  return tableName;
}
