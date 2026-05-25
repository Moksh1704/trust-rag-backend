import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeBlog = async (url) => {

  try {

    // ========================================
    // FETCH PAGE
    // ========================================

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    // ========================================
    // DEFAULT VALUES
    // ========================================

    let title = 'Untitled Blog';
    let author = 'Unknown';
    let publishedDate = null;
    let articleText = '';

    // ========================================
    // EXTRACT NEXT.JS HYDRATION JSON
    // ========================================

    const nextDataScript =
      $('#__NEXT_DATA__').html();

    if (nextDataScript) {

      try {

        const parsedData =
          JSON.parse(nextDataScript);

        const tutorial =
          parsedData?.props
            ?.pageProps
            ?.data
            ?.tutorial;

        if (tutorial) {

          // ========================================
          // TITLE
          // ========================================

          title =
            tutorial.title || title;

          // ========================================
          // CONTENT
          // ========================================

          articleText =
            tutorial.content || '';

          // ========================================
          // AUTHOR
          // ========================================

          if (
            tutorial.authors &&
            tutorial.authors.length > 0
          ) {

            const firstAuthor =
              tutorial.authors[0].user;

            author =
              `${firstAuthor.first_name || ''} ${firstAuthor.last_name || ''}`
                .trim();
          }

          // ========================================
          // DATE
          // ========================================

          publishedDate =
            tutorial.published_at || null;
        }

      } catch (jsonError) {

        console.log(
          'Failed to parse __NEXT_DATA__ JSON'
        );
      }
    }

    // ========================================
    // FALLBACK EXTRACTION
    // ========================================

    if (!articleText || articleText.length < 200) {

      $(
        `
        script,
        style,
        nav,
        footer,
        header,
        aside,
        form,
        iframe,
        noscript
        `
      ).remove();

      articleText =

        $('article').text() ||

        $('main').text() ||

        $('body').text();

      title =

        $('meta[property="og:title"]')
          .attr('content') ||

        $('title').text() ||

        title;

      author =

        $('meta[name="author"]')
          .attr('content') ||

        $('meta[property="article:author"]')
          .attr('content') ||

        $('[rel="author"]')
          .first()
          .text()
          .trim() ||

        $('.author-name')
          .text()
          .trim() ||

        author;

      publishedDate =

        $('meta[property="article:published_time"]')
          .attr('content') ||

        $('time')
          .attr('datetime') ||

        publishedDate;
    }

    // ========================================
    // CLEAN TEXT
    // ========================================

    const cleanText = articleText

      // remove markdown code blocks
      .replace(/```[\s\S]*?```/g, ' ')

      // remove inline code
      .replace(/`/g, ' ')

      // remove markdown headings
      .replace(/#+\s/g, ' ')

      // remove markdown styling
      .replace(/[_*~]/g, '')

      // remove markdown links
      .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')

      // remove html tags
      .replace(/<[^>]*>/g, ' ')

      // remove extra spaces
      .replace(/\s+/g, ' ')

      .trim();

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !cleanText ||
      cleanText.length < 200
    ) {

      throw new Error(
        'Unable to extract meaningful article content'
      );
    }

    // ========================================
    // RETURN CLEAN DATA
    // ========================================

    return {

      source_url: url,

      source_type: 'blog',

      title,

      author,

      published_date: publishedDate,

      text: cleanText
    };

  } catch (error) {

    throw new Error(
      `Blog scraping failed: ${error.message}`
    );
  }
};