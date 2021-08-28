import * as cdk from '@aws-cdk/core';
import * as crs from 'cdk-remote-stack';

/** Props for `StackOutputsSingleton` */
export interface StackOutputsSingletonProps {
  /** The stack with outputs we want to access. */
  readonly stack: cdk.Stack;
}

/** Provides access to a single StackOutputs per stack, account, and region. */
export class StackOutputsSingleton extends cdk.Construct {
  /** The stack outputs */
  public readonly stackOutputs: crs.StackOutputs;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: StackOutputsSingletonProps,
  ) {
    super(scope, id);

    const givenStack = props.stack;
    const stackOutputsId = renderStackOutputsId(givenStack);

    const thisStack = cdk.Stack.of(this);

    this.stackOutputs =
      (thisStack.node.tryFindChild(stackOutputsId) as crs.StackOutputs) ??
      new crs.StackOutputs(thisStack, stackOutputsId, {
        stack: givenStack,
        alwaysUpdate: true,
      });
  }
}

function renderStackOutputsId(givenStack: cdk.Stack) {
  const stackName = givenStack.stackName;

  const region = !isToken(givenStack.region) ? givenStack.region : 'token';
  const account = !isToken(givenStack.account) ? givenStack.account : 'token';

  return `StackOutputsR${region}A${account}S${stackName}`;
}

const TOKEN_MATCH = /^\${Token\[.*/;

function isToken(value: string) {
  return TOKEN_MATCH.test(value);
}
