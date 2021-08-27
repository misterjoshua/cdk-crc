import type * as lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { FUNCTION_DATABASE_ENV_NAME } from '../constants';
import { HitCounter } from '../hit-counter';

export async function handler(
  event: lambda.APIGatewayProxyEventV2,
  _context: unknown,
): Promise<lambda.APIGatewayProxyResultV2> {
  const tableName = getDatabaseTableName();
  const dynamoDB = new AWS.DynamoDB();

  const hitCounter = new HitCounter({
    dynamoDB,
    tableName,
  });

  const hitCount = await hitCounter.hit();

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      hitCount,
    }),
  };
}

function getDatabaseTableName() {
  const tableName = process.env[FUNCTION_DATABASE_ENV_NAME];
  if (!tableName) {
    throw new Error(
      `This handler is misconfigured. Please provide the \`${FUNCTION_DATABASE_ENV_NAME}\` environment variable.`,
    );
  }
  return tableName;
}
