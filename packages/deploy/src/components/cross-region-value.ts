import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as crs from 'cdk-remote-stack';

/** Props for `CrossRegionValue` */
export interface CrossRegionValueProps<ValueType, PropsType> {
  /**
   * The value to make available across regions.
   *
   * If a user tries to get this value from a directly accessible scope, this
   * value will be provided as-is, without running the producer.
   */
  readonly value: ValueType;

  /** Props needed to produce the value. */
  readonly props: PropsType;

  /** A function that produces the value in another stack. */
  readonly produce: CrossRegionValueProducer<ValueType, PropsType>;
}

/** User-provided value producer */
export type CrossRegionValueProducer<ValueType, PropsType> = (
  scope: cdk.Construct,
  id: string,
  props: PropsType,
) => ValueType;

export type CrossRegionStringValueProps = { value: string };

/**
 * Restores a value across stacks and possibly regions.
 */
export class CrossRegionValue<
  ValueType,
  PropsType extends object,
> extends cdk.Construct {
  public static fromString(scope: cdk.Construct, id: string, value: string) {
    return new CrossRegionValue<string, CrossRegionStringValueProps>(
      scope,
      id,
      {
        value,
        props: { value },
        produce: (_scope, _id, props) => props.value,
      },
    );
  }

  public static fromS3Bucket(
    scope: cdk.Construct,
    id: string,
    bucket: s3.Bucket,
  ) {
    return new CrossRegionValue<s3.IBucket, s3.BucketAttributes>(scope, id, {
      value: bucket,
      props: {
        bucketName: bucket.bucketName,
        bucketArn: bucket.bucketArn,
        bucketDomainName: bucket.bucketDomainName,
        bucketRegionalDomainName: bucket.bucketRegionalDomainName,
        bucketDualStackDomainName: bucket.bucketDualStackDomainName,
        bucketWebsiteUrl: bucket.bucketWebsiteUrl,
      },
      produce: (scope, id, props) =>
        s3.Bucket.fromBucketAttributes(scope, id, {
          ...props,
          bucketWebsiteNewUrlFormat: true,
          isWebsite: bucket.isWebsite,
        }),
    });
  }

  private readonly uniqueId: string;
  private readonly value: ValueType;
  private readonly props: PropsType;
  private readonly produce: CrossRegionValueProducer<ValueType, PropsType>;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: CrossRegionValueProps<ValueType, PropsType>,
  ) {
    super(scope, id);

    this.uniqueId = cdk.Names.uniqueId(this);
    this.value = props.value;
    this.props = props.props;
    this.produce = props.produce;

    const stack = cdk.Stack.of(this);
    for (const [memoKey, value] of Object.entries(this.props)) {
      new cdk.CfnOutput(stack, this.outputName(memoKey), {
        value: value,
      });
    }
  }

  /**
   * Get the cross-regional value in the given scope.
   */
  public getValueInScope(scope: cdk.Construct, id: string): ValueType {
    const valueStack = cdk.Stack.of(this);
    const scopeStack = cdk.Stack.of(scope);

    if (valueStack === scopeStack) {
      return this.value;
    }

    scopeStack.addDependency(valueStack);

    const stackOutputs = getStackOutputs({
      scope,
      remoteStack: valueStack,
    });

    // Reconstruct the prop values from a
    const props: Record<string, string> = {};
    for (const key of Object.keys(this.props)) {
      const outputName = this.outputName(key);
      props[key] = stackOutputs.getAttString(outputName);
    }

    return this.produce(scope, id, props as PropsType);
  }

  private outputName(key: string) {
    return `${this.uniqueId}Prop${key}`;
  }
}

/** Props for `StackOutputsSingleton` */
export interface GetStackOutputsOptions {
  /** Scope of the stack that wants the outputs */
  readonly scope: cdk.Construct;
  /** The stack with outputs we want to access. */
  readonly remoteStack: cdk.Stack;
}

/** Get a `StackOutputs` for the given remote stack. */
function getStackOutputs(options: GetStackOutputsOptions) {
  const { scope, remoteStack } = options;

  const scopeStack = cdk.Stack.of(scope);
  const stackOutputsId = renderStackOutputsId(remoteStack);

  const extantStackOutputs = scopeStack.node.tryFindChild(
    stackOutputsId,
  ) as crs.StackOutputs;
  if (extantStackOutputs) return extantStackOutputs;

  return new crs.StackOutputs(scopeStack, stackOutputsId, {
    stack: remoteStack,
    alwaysUpdate: true,
  });
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
