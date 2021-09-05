import * as s3 from '@aws-cdk/aws-s3';

export interface ComponentBaseProps {
  readonly bucket: s3.IBucket;
}
