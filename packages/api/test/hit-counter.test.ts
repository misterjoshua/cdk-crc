import type * as AWS from 'aws-sdk';
import { HitCounter } from '../src/hit-counter';
import { getDynamoDB, setupTable } from './dynamodb-setup';

test('setupTable', async () => {
  const dynamoDB = getDynamoDB();
  const tableName = await setupTable(dynamoDB);

  const tables = await dynamoDB.listTables().promise();
  expect(tables.TableNames).toEqual(expect.arrayContaining([tableName]));
}, 30000);

describe('hit-counter', () => {
  let dynamoDB: undefined | AWS.DynamoDB;
  let tableName: undefined | string;
  beforeEach(async () => {
    dynamoDB = await getDynamoDB();
    tableName = await setupTable(dynamoDB);
  });

  test('first hit', async () => {
    const hitCounter = new HitCounter({
      tableName: tableName!,
      dynamoDB: dynamoDB!,
    });

    const hitCount = await hitCounter.hit();
    expect(hitCount).toEqual(1);
  });

  test('second hit', async () => {
    const hitCounter = new HitCounter({
      tableName: tableName!,
      dynamoDB: dynamoDB!,
    });

    await hitCounter.hit();
    const hitCount = await hitCounter.hit();
    expect(hitCount).toEqual(2);
  });
});