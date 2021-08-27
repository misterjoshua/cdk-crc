import type { DynamoDB } from 'aws-sdk';

export abstract class HitCounter {
  static optimisticallyLocking(options: HitCounterOptions): HitCounter {
    return new OptimisticLockingHitCounter(options);
  }

  static expressionIncrementing(options: HitCounterOptions): HitCounter {
    return new ExpressionIncrementingHitCounter(options);
  }

  abstract hit(): Promise<number>;
}

export interface HitCounterOptions {
  readonly dynamoDB: DynamoDB;
  readonly tableName: string;
}

abstract class BaseHitCounter extends HitCounter {
  protected readonly key: DynamoDB.Key = {
    PK: { S: 'HIT_COUNTER' },
    SK: { S: 'HIT_COUNTER' },
  };
  protected readonly attributeName = 'HitCount';

  protected readonly dynamoDB: DynamoDB;
  protected readonly tableName: string;

  protected constructor(options: HitCounterOptions) {
    super();
    this.dynamoDB = options.dynamoDB;
    this.tableName = options.tableName;
  }

  abstract hit(): Promise<number>;
}

class ExpressionIncrementingHitCounter extends BaseHitCounter {
  constructor(options: HitCounterOptions) {
    super(options);
  }

  async hit(): Promise<number> {
    const item = await this.dynamoDB
      .updateItem({
        TableName: this.tableName,
        Key: this.key,
        ReturnValues: 'UPDATED_NEW',
        UpdateExpression:
          'SET #HitCount = if_not_exists(#HitCount, :Initial) + :Increment',
        ExpressionAttributeNames: {
          '#HitCount': this.attributeName,
        },
        ExpressionAttributeValues: {
          ':Initial': { N: '0' },
          ':Increment': { N: '1' },
        },
      })
      .promise();

    if (item.Attributes && item.Attributes[this.attributeName]) {
      return parseInt(item.Attributes[this.attributeName].N ?? '1');
    } else {
      return 1;
    }
  }
}

class OptimisticLockingHitCounter extends BaseHitCounter {
  constructor(options: HitCounterOptions) {
    super(options);
  }

  async hit(): Promise<number> {
    const previousHitCount = await this.getHits();
    const nextHitCount = previousHitCount + 1;

    // Update the hit count with optimistic locking.
    await this.dynamoDB
      .updateItem({
        TableName: this.tableName,
        Key: this.key,
        ReturnValues: 'NONE',
        UpdateExpression: 'SET #HitCount = :NextHitCount',
        ConditionExpression:
          'attribute_not_exists(#HitCount) OR #HitCount = :PreviousHitCount',
        ExpressionAttributeNames: {
          '#HitCount': this.attributeName,
        },
        ExpressionAttributeValues: {
          ':PreviousHitCount': { N: previousHitCount.toString() },
          ':NextHitCount': { N: nextHitCount.toString() },
        },
      })
      .promise();

    return nextHitCount;
  }

  private async getHits() {
    try {
      const item = await this.dynamoDB
        .getItem({
          TableName: this.tableName,
          Key: this.key,
        })
        .promise();

      if (!item.Item || !item.Item[this.attributeName]) {
        return 0;
      }

      return parseInt(item.Item[this.attributeName].N ?? '0');
    } catch (e) {
      if (e.toString().contains('ResourceNotFoundException')) {
        return 0;
      }

      // Other errors.
      throw e;
    }
  }
}
