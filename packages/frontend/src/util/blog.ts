export function getBlogHref(item) {
  return `/blog/posts/${item.slug}`;
}

interface BlogDataOptions {
  /** WP API Base URL */
  readonly apiBaseUrl: string;
}

/** Access to the blog data */
export class BlogData {
  static instance(): BlogData {
    return new BlogData({
      apiBaseUrl:
        'https://public-api.wordpress.com/wp/v2/sites/joshkellendonk.wordpress.com/',
    });
  }

  private readonly apiBaseUrl: string;

  constructor(options: BlogDataOptions) {
    this.apiBaseUrl = options.apiBaseUrl;
  }

  async getIndexResult(page: number): Promise<BlogIndexResult> {
    const res = await fetch(`${this.apiBaseUrl}posts?page=${page}`);

    // @see https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages'));
    const totalPosts = parseInt(res.headers.get('X-WP-Total'));

    let posts: BlogPost[];
    if (totalPosts === 0) {
      posts = [];
    } else {
      const postsJson = await res.json();
      posts = postsJson.map(mapPostToBlogIndexItem);
    }

    return {
      posts,
      page,
      totalPages,
      totalPosts,
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${this.apiBaseUrl}posts?slug=${slug}`);
    const totalPosts = parseInt(res.headers.get('X-WP-Total'));

    if (totalPosts === 0) {
      throw new BlogDataNotFoundError();
    }

    const posts = await res.json();
    return posts.map(mapPostToBlogIndexItem)[0];
  }
}

export class BlogDataNotFoundError extends Error {}

export interface BlogIndexResult {
  readonly page: number;
  readonly posts: BlogPost[];
  readonly totalPages: number;
  readonly totalPosts: number;
}

export interface BlogPost {
  readonly slug: string;
  readonly author: string;
  readonly title: string;
  readonly date: string;
  readonly excerpt: string;
  readonly content: string;
}

export function mapPostToBlogIndexItem(post: any): BlogPost {
  return {
    slug: post.slug,
    title: post.title.rendered,
    author: 'Josh Kellendonk',
    date: post.date_gmt,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
  };
}

export function getBlogIndexPageHref(page: number) {
  return page > 1 ? `/blog/${page}` : '/blog';
}

export function getBlogPostHref(post: BlogPost) {
  return `/blog/posts/${post.slug}`;
}

/**
 * Amount of seconds after which a blog page can be incrementally regenerated
 */
export const BLOG_REVALIDATION_SECONDS = 10;
