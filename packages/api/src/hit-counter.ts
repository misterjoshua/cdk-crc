import type { DynamoDB } from 'aws-sdk';

export interface HitCounterOptions {
  readonly dynamoDB: DynamoDB;
  readonly tableName: string;
}

export class HitCounter {
  private readonly dynamoDB: DynamoDB;
  private readonly tableName: string;

  private readonly key: DynamoDB.Key = {
    PK: { S: 'HIT_COUNTER' },
    SK: { S: 'HIT_COUNTER' },
  };
  private readonly attributeName = 'HitCount';

  constructor(options: HitCounterOptions) {
    this.dynamoDB = options.dynamoDB;
    this.tableName = options.tableName;
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
