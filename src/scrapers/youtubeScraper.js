import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript }
from 'youtube-transcript';

export const scrapeYouTube = async (
  url
) => {

  try {

    // ========================================
    // FETCH HTML
    // ========================================

    const { data } =
      await axios.get(url);

    const $ = cheerio.load(data);

    // ========================================
    // TITLE EXTRACTION
    // ========================================

    const title =

      $('title')
        .text()
        .replace(' - YouTube', '')
        .trim();

    // ========================================
    // AUTHOR EXTRACTION
    // ========================================

    let author =
      'Unknown Channel';

   const authorMeta =

  $('meta[name="author"]')
    .attr('content') ||

  $('link[itemprop="name"]')
    .attr('content') ||

  $('meta[property="og:video:tag"]')
    .attr('content');
    if (authorMeta) {

      author = authorMeta;
    }

    // ========================================
    // DATE EXTRACTION
    // ========================================

    let publishedDate = null;

    const publishMeta =

      $('meta[itemprop="datePublished"]')
        .attr('content');

    if (publishMeta) {

      publishedDate =
        publishMeta;
    }

    // ========================================
    // TRANSCRIPT EXTRACTION
    // ========================================

    const transcriptArray =

      await YoutubeTranscript.fetchTranscript(
        url
      );

    const transcript =

      transcriptArray
        .map(item => item.text)
        .join(' ');

    return {

      source_url: url,

      source_type: 'youtube',

      title,

      author,

      published_date:
        publishedDate,

      text: transcript
    };

  } catch (error) {

    throw new Error(

      `YouTube scraping failed: ${error.message}`
    );
  }
};