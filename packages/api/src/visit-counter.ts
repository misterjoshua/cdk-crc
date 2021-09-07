import type { DynamoDB } from 'aws-sdk';

export abstract class VisitCounter {
  static expressionIncrementing(options: VisitCounterOptions): VisitCounter {
    return new ExpressionIncrementingVisitCounter(options);
  }

  abstract hit(): Promise<number>;
}

export interface VisitCounterOptions {
  readonly dynamoDB: DynamoDB;
  readonly tableName: string;
}

abstract class BaseVisitCounter extends VisitCounter {
  protected readonly key: DynamoDB.Key = {
    PK: { S: 'HIT_COUNTER' },
    SK: { S: 'HIT_COUNTER' },
  };
  protected readonly attributeName = 'HitCount';

  protected readonly dynamoDB: DynamoDB;
  protected readonly tableName: string;

  protected constructor(options: VisitCounterOptions) {
    super();
    this.dynamoDB = options.dynamoDB;
    this.tableName = options.tableName;
  }

  abstract hit(): Promise<number>;
}

class ExpressionIncrementingVisitCounter extends BaseVisitCounter {
  constructor(options: VisitCounterOptions) {
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
