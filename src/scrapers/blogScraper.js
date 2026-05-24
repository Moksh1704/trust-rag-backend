import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlog(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    // Extract title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text().trim();

    // Extract author
    const author =
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      'Unknown';

    // Extract publish date
    const publishedDate =
      $('meta[property="article:published_time"]').attr('content') ||
      $('time').attr('datetime') ||
      null;

    // Extract article text
    let articleText = '';

    $('article p').each((i, el) => {
      articleText += $(el).text() + ' ';
    });

    // fallback if article tag missing
    if (!articleText.trim()) {
      $('p').each((i, el) => {
        articleText += $(el).text() + ' ';
      });
    }

    articleText = articleText.replace(/\s+/g, ' ').trim();

    return {
      source_url: url,
      source_type: 'blog',
      title,
      author,
      published_date: publishedDate,
      text: articleText
    };

  } catch (error) {
    throw new Error(`Blog scraping failed: ${error.message}`);
  }
}