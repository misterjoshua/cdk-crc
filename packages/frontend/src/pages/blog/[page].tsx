import parse from 'html-react-parser';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ContentSection } from '../../components/content-section';
import { EasyReading } from '../../components/easy-reading';
import { PageLayout } from '../../components/page-layout';
import {
  BASE_HUE_BLOG,
  NiceTranslucentBox,
  ParticularlyHeroic,
} from '../../components/particularly-heroic';
import { PostInfoDisplay } from '../../components/post-info-display';
import { TextBlock } from '../../components/text-block';
import {
  BlogData,
  BlogIndexResult,
  BLOG_REVALIDATION_SECONDS,
  getBlogIndexPageHref,
  getBlogPostHref,
} from '../../util/blog';
import { getQueryParamOrDefault } from '../../util/get-query-param';

export interface BlogIndexProps {
  readonly indexResult: BlogIndexResult;
}

export default function BlogIndex(props: BlogIndexProps) {
  const indexResult = props.indexResult;

  const page = indexResult.page;
  const totalPages = indexResult.totalPages;
  const posts = indexResult.posts;

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
          <EasyReading>
            <h1 className="text-center">Josh's Blog</h1>
            <p className="text-center">
              A trove of tips for AWS, Containers, Serverless, CDK, and anything
              in-between.
            </p>
          </EasyReading>
        </NiceTranslucentBox>
      </ParticularlyHeroic>

      <ContentSection>
        <TextBlock>
          {posts.map((post, i) => (
            <section key={i} className="index-post">
              <EasyReading>
                <h2 className="index-post-title">
                  <Link href={getBlogPostHref(post)}>{parse(post.title)}</Link>
                </h2>

                <PostInfoDisplay post={post} />

                {parse(post.excerpt)}
              </EasyReading>
            </section>
          ))}
        </TextBlock>
      </ContentSection>

      <ContentSection>
        <BlogIndexPagination page={page} totalPages={totalPages} />
      </ContentSection>

      <style jsx>{`
        .index-post {
          padding: 1rem;
        }
      `}</style>
    </PageLayout>
  );
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<BlogIndexProps>> {
  const pageNumber = parseInt(
    getQueryParamOrDefault(context.params, 'page', '1'),
  );

  return await getStaticPropsForPageNumber(pageNumber);
}

export async function getStaticPropsForPageNumber(pageNumber: number) {
  const indexResult = await BlogData.instance().getIndexResult(pageNumber);

  return {
    props: { indexResult },
    revalidate: BLOG_REVALIDATION_SECONDS,
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const index = await BlogData.instance().getIndexResult(1);

  // 2 .. lastPage
  // @see https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
  const rangeEnd = Math.max(0, index.totalPages - 2);
  const pageNumbers = Array.from(Array(rangeEnd).keys()).map((n) => n + 2);

  return {
    paths: pageNumbers.map((page) => ({
      params: { page: page.toString() },
    })),
    fallback: 'blocking',
  };
}

interface BlogIndexPaginationProps {
  readonly page: number;
  readonly totalPages: number;
}

export const BlogIndexPagination: React.FC<BlogIndexPaginationProps> = ({
  page,
  totalPages,
}) => (
  <TextBlock>
    <EasyReading>
      <nav
        aria-label="Blog Page Navigation"
        className="d-flex justify-content-between align-items-center container"
      >
        <div className="nav-item button previous">
          {page > 1 && (
            <Link href={getBlogIndexPageHref(page - 1)} passHref>
              <button className="btn btn-dark btn-lg" aria-label="Next Page">
                &laquo;
              </button>
            </Link>
          )}
        </div>
        <div className="nav-item">
          Page {page} of {totalPages}
        </div>
        <div className="nav-item button next">
          {page < totalPages && (
            <Link href={getBlogIndexPageHref(page + 1)} passHref>
              <button
                className="btn btn-dark btn-lg"
                aria-label="Previous Page"
              >
                &raquo;
              </button>
            </Link>
          )}
        </div>
        <style jsx>{`
          .nav-item.button {
            width: 25%;
          }

          .nav-item.previous {
            text-align: left;
          }

          .nav-item.next {
            text-align: right;
          }
        `}</style>
      </nav>
    </EasyReading>
  </TextBlock>
);
