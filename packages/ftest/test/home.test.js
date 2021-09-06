const timeout = 600000;

function getBaseUrl() {
  return process.env.BASE_URL || 'https://cdk-crc-dev.kellendonk.ca/';
}

describe(
  '/ (Home Page)',
  () => {
    let page;
    beforeEach(async () => {
      page = await global.__BROWSER__.newPage();
      await page.goto(getBaseUrl());
    }, timeout);

    it(
      'has my name',
      async () => {
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toEqual(expect.stringMatching(/josh kellendonk/i));
      },
      timeout,
    );

    it(
      'has a view count',
      async () => {
        await page.waitForSelector('.hit-count-loaded');
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toEqual(expect.stringMatching(/viewed.*\d+.*times/i));
      },
      timeout,
    );

    it(
      'clicks to the blog',
      async () => {
        // Click the hamburger menu to expand the menu
        await page.click('button.navbar-toggler');

        // Click to the blog
        await page.click('.nav-link[href*="blog"]');

        // Wait for the blog to load then find the text of the first blog link
        await page.waitForSelector(
          '.index-post:first-child .index-post-title a',
        );
        const blogTitle = await page.evaluate(
          () =>
            document.querySelector(
              '.index-post:first-child .index-post-title a',
            ).textContent,
        );

        // Click through to the blog
        await page.click('.index-post:first-child .index-post-title a');
        await page.waitForSelector('h1.post-title');

        // Check if the blog post title is the same as the title of the link to it
        const postTitle = await page.evaluate(
          () => document.querySelector('h1.post-title').textContent,
        );
        expect(blogTitle).toEqual(postTitle);
      },
      timeout,
    );
  },
  timeout,
);
