import parse from 'html-react-parser';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ContentSection } from '../../../components/content-section';
import { DateDisplay } from '../../../components/date-display';
import { JoshProfile } from '../../../components/josh-profile';
import { PageLayout } from '../../../components/page-layout';
import {
  BASE_HUE_BLOG,
  NiceTranslucentBox,
  ParticularlyHeroic,
} from '../../../components/particularly-heroic';
import { TextBlock } from '../../../components/text-block';
import { BlogData, BlogPost } from '../../../util/blog';

export interface BlogPostPageIndex {
  readonly post: BlogPost;
}

export default function BlogPostPage(props: BlogPostPageIndex) {
  const post = props.post;

  return (
    <PageLayout>
      <Head>
        <title>Josh's Blog</title>
      </Head>

      <ParticularlyHeroic baseHue={BASE_HUE_BLOG}>
        <NiceTranslucentBox>
          <h1 className="post-title">{parse(post.title)}</h1>
          <p>
            <DateDisplay date={new Date(Date.parse(post.date))} />
          </p>
          <div className="text-center">{parse(post.excerpt)}</div>
        </NiceTranslucentBox>
      </ParticularlyHeroic>

      <ContentSection dark>
        <JoshProfile blogPost />
      </ContentSection>

      <ContentSection>
        <TextBlock>{parse(post.content)}</TextBlock>
      </ContentSection>

      <style jsx>{`
        .post-title {
          font-size: 1.5rem;
        }
      `}</style>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<BlogPostPageIndex> = async (
  context,
) => {
  const slug = Array.isArray(context.query.slug)
    ? context.query.slug[0]
    : context.query.slug;
  const blogData = BlogData.get();

  return {
    props: {
      post: await blogData.getPostBySlug(slug),
    },
  };
};
