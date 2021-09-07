import parse from 'html-react-parser';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import Head from 'next/head';
import { ContentSection } from '../../../components/content-section';
import { DateDisplay } from '../../../components/date-display';
import { EasyReading } from '../../../components/easy-reading';
import { JoshProfile } from '../../../components/josh-profile';
import { PageLayout } from '../../../components/page-layout';
import {
  BASE_HUE_BLOG,
  NiceTranslucentBox,
  ParticularlyHeroic,
} from '../../../components/particularly-heroic';
import { TextBlock } from '../../../components/text-block';
import { WordpressContentDisplay } from '../../../components/wordpress-content-display';
import {
  BlogData,
  BlogDataNotFoundError,
  BlogPost,
  BLOG_REVALIDATION_SECONDS,
} from '../../../util/blog';
import { getQueryParam } from '../../../util/get-query-param';
import { stripTags } from '../../../util/strip-tags';

export interface BlogPostPageProps {
  readonly post: BlogPost;
}

export default function BlogPostPage(props: BlogPostPageProps) {
  const post = props.post;

  return (
    <PageLayout>
      <Head>
        <title>{parse(post.title)} - Josh's Blog</title>
        <meta name="description" content={stripTags(post.excerpt)} />
      </Head>

      <ParticularlyHeroic baseHue={BASE_HUE_BLOG}>
        <NiceTranslucentBox>
          <EasyReading>
            <h1 className="post-title text-center">{parse(post.title)}</h1>
            <p className="text-center">
              <DateDisplay date={new Date(Date.parse(post.date))} />
            </p>
            <div className="text-center">{parse(post.excerpt)}</div>
          </EasyReading>
        </NiceTranslucentBox>
      </ParticularlyHeroic>

      <ContentSection dark>
        <JoshProfile blogPost />
      </ContentSection>

      <ContentSection>
        <TextBlock>
          <EasyReading>
            <WordpressContentDisplay content={post.content} />
          </EasyReading>
        </TextBlock>
      </ContentSection>
    </PageLayout>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<BlogPostPageProps>> {
  const slug = getQueryParam(context.params, 'slug');

  try {
    const post = await BlogData.instance().getPostBySlug(slug);
    return {
      props: { post },
      revalidate: BLOG_REVALIDATION_SECONDS,
    };
  } catch (e) {
    if (e instanceof BlogDataNotFoundError) {
      return {
        notFound: true,
        revalidate: BLOG_REVALIDATION_SECONDS,
      };
    }

    throw e;
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    // We depend on fallback rendering for all the blog posts.
    paths: [],
    fallback: 'blocking',
  };
}
