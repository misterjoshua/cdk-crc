import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { StackOutputsSingleton } from './stack-outputs-singleton';

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

/**
 * Restores a value across stacks and possibly regions.
 */
export class CrossRegionValue<
  ValueType,
  PropsType extends object,
> extends cdk.Construct {
  public static fromString(scope: cdk.Construct, id: string, value: string) {
    return new CrossRegionValue(scope, id, {
      value,
      props: { value },
      produce: (_scope, _id, props) => props.value,
    });
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
        }),
    });
  }

  private readonly uniqueId: string;
  private readonly value: ValueType;
  private readonly props: PropsType;
  private readonly produce: (
    scope: cdk.Construct,
    id: string,
    props: PropsType,
  ) => ValueType;

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
  public getValueInScope(scope: cdk.Construct): ValueType {
    const valueStack = cdk.Stack.of(this);
    const scopeStack = cdk.Stack.of(scope);

    if (valueStack === scopeStack) {
      return this.value;
    }

    scopeStack.addDependency(valueStack);

    const stackOutputsId = this.uniqueSuffixedId('StackOutputs');
    const { stackOutputs } = new StackOutputsSingleton(scope, stackOutputsId, {
      stack: valueStack,
    });

    // Reconstruct the prop values from a
    const props: Record<string, string> = {};
    for (const key of Object.keys(this.props)) {
      const outputName = this.outputName(key);
      props[key] = stackOutputs.getAttString(outputName);
    }

    const id = this.uniqueSuffixedId('Produce');
    return this.produce(scope, id, props as PropsType);
  }

  private outputName(key: string) {
    return this.uniqueSuffixedId(`Prop${key}`);
  }

  private uniqueSuffixedId(suffix: string = ''): string {
    return `${this.uniqueId}${suffix}`;
  }
}
