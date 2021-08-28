import * as cdk from '@aws-cdk/core';
import { Database } from '../components/database';

export class RegionalStatefulStack extends cdk.Stack {
  public readonly database: Database;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.database = new Database(this, 'Database');
  }
}
