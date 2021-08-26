import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class Database extends cdk.Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    // Single-table design.
    this.table = new dynamodb.Table(this, 'Table', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}