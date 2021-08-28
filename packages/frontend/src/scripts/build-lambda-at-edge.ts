import { Builder } from '@sls-next/lambda-at-edge';

const builder = new Builder('.', './out-lambda', {
  cmd: 'yarn',
  args: ['next', 'build'],
});

builder.build().catch((e) => {
  console.error(e);
  process.exit(1);
});
