import { GetServerSidePropsResult } from 'next';
import React from 'react';

export interface PageProps {
  readonly value: string;
}

export default function Page(props) {
  return <div>Props value: {props.value}</div>;
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<PageProps>
> {
  return {
    props: {
      value: `getServerSideProps: ${Math.random().toString(16)}`,
    },
  };
}
