export function getBlogHref(item) {
  return `/blog/posts/${item.slug}`;
}

interface BlogDataOptions {
  /** WP API Base URL */
  readonly apiBaseUrl: string;
}

/** Access to the blog data */
export class BlogData {
  static get(): BlogData {
    return new BlogData({
      apiBaseUrl:
        'https://public-api.wordpress.com/wp/v2/sites/joshkellendonk.wordpress.com/',
    });
  }

  private readonly apiBaseUrl: string;

  constructor(options: BlogDataOptions) {
    this.apiBaseUrl = options.apiBaseUrl;
  }

  async getIndexPage(page: number): Promise<BlogPost[]> {
    const posts = await this.fetchFromApi(`posts?page=${page}`);
    return posts.map(mapPostToBlogIndexItem);
  }

  async getPostBySlug(slug: string): Promise<BlogPost> {
    const posts = await this.fetchFromApi(`posts?slug=${slug}`);
    return posts.map(mapPostToBlogIndexItem)[0];
  }

  private async fetchFromApi(input: string) {
    const res = await fetch(`${this.apiBaseUrl}${input}`);
    return await res.json();
  }
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
