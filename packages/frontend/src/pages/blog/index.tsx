import { GetStaticPropsResult } from 'next';
import BlogIndex, {
  BlogIndexProps,
  getStaticPropsForPageNumber,
} from './[page]';

// The index pages are all their code, except that for the first page, the page
// number is always 1.
export default BlogIndex;

export async function getStaticProps(): Promise<
  GetStaticPropsResult<BlogIndexProps>
> {
  return getStaticPropsForPageNumber(1);
}
