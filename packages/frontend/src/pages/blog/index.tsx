import parse from 'html-react-parser';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ContentSection } from '../../components/content-section';
import { PageLayout } from '../../components/page-layout';
import {
  BASE_HUE_BLOG,
  NiceTranslucentBox,
  ParticularlyHeroic,
} from '../../components/particularly-heroic';
import { PostInfoDisplay } from '../../components/post-info-display';
import { EasyReading, TextBlock } from '../../components/text-block';
import { BlogData, BlogPost, getBlogHref } from '../../util/blog';

export interface BlogIndexProps {
  readonly items: BlogPost[];
}

export default function BlogIndex(props: BlogIndexProps) {
  const posts = props.items;

  return (
    <PageLayout>
      <Head>
        <title>Josh's Blog</title>
        <meta
          name="description"
          content="A trove of tips for AWS, Containers, Serverless, CDK, and anything in-between."
        />
      </Head>

      <ParticularlyHeroic baseHue={BASE_HUE_BLOG}>
        <NiceTranslucentBox>
          <h1>Josh's Blog</h1>
          <p>
            A trove of tips for AWS, Containers, Serverless, CDK, and anything
            in-between.
          </p>
        </NiceTranslucentBox>
      </ParticularlyHeroic>

      <ContentSection>
        <TextBlock>
          {posts.map((post, i) => (
            <BlogPostPreviewDisplay key={i} post={post} />
          ))}
        </TextBlock>
      </ContentSection>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<BlogIndexProps> = async (
  context,
) => {
  const page = Array.isArray(context.query.page)
    ? context.query.page[0]
    : context.query.page;
  const pageNumber = parseInt(page ?? '1');

  const blogData = BlogData.get();

  return {
    props: {
      items: await blogData.getIndexPage(pageNumber),
    },
  };
};

export interface BlogPostPreviewDisplayProps {
  readonly post: BlogPost;
}

export const BlogPostPreviewDisplay: React.FC<BlogPostPreviewDisplayProps> = (
  props,
) => {
  const post = props.post;

  return (
    <section className="index-post">
      <EasyReading>
        <h2 className="index-post-title">
          <Link href={getBlogHref(post)}>{parse(post.title)}</Link>
        </h2>

        <PostInfoDisplay post={post} />

        {parse(post.excerpt)}

        <style jsx>{`
          section {
            padding: 1rem;
          }
        `}</style>
      </EasyReading>
    </section>
  );
};
