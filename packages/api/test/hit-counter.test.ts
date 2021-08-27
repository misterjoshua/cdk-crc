import { HitCounter } from '../src/hit-counter';
import { getDynamoDB, initTable } from './dynamodb-init';

const TEST_TABLE_NAME = 'TEST_TABLE';

const dynamoDB = getDynamoDB();
beforeEach(async () => {
  await initTable(dynamoDB, TEST_TABLE_NAME);
});

test('setupTable', async () => {
  const tables = await dynamoDB.listTables().promise();
  expect(tables.TableNames).toEqual(expect.arrayContaining([TEST_TABLE_NAME]));

  const items = await dynamoDB
    .scan({
      TableName: TEST_TABLE_NAME,
    })
    .promise();

  expect(items.Items?.length).toEqual(0);
}, 30000);

describe('HitCounter.optimisticallyLocking', () => {
  test('first hit', async () => {
    // GIVEN
    const hitCounter = HitCounter.optimisticallyLocking({
      tableName: TEST_TABLE_NAME,
      dynamoDB: dynamoDB,
    });

    // WHEN
    const hitCount = await hitCounter.hit();

    // THEN
    expect(hitCount).toEqual(1);
  });

  test('second hit', async () => {
    // GIVEN
    const hitCounter = HitCounter.optimisticallyLocking({
      tableName: TEST_TABLE_NAME,
      dynamoDB: dynamoDB,
    });

    await hitCounter.hit(); // First hit

    // WHEN
    const hitCount = await hitCounter.hit();

    // THEN
    expect(hitCount).toEqual(2);
  });
});

describe('HitCounter.expressionIncrementing', () => {
  test('first hit', async () => {
    // GIVEN
    const hitCounter = HitCounter.expressionIncrementing({
      tableName: TEST_TABLE_NAME,
      dynamoDB: dynamoDB,
    });

    // WHEN
    const hitCount = await hitCounter.hit();

    // THEN
    expect(hitCount).toEqual(1);
  });

  test('second hit', async () => {
    // GIVEN
    const hitCounter = HitCounter.expressionIncrementing({
      tableName: TEST_TABLE_NAME,
      dynamoDB: dynamoDB,
    });

    await hitCounter.hit(); // First hit

    // WHEN
    const hitCount = await hitCounter.hit();

    // THEN
    expect(hitCount).toEqual(2);
  });
});
