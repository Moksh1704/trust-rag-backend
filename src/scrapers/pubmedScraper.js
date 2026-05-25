import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapePubMed = async (
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

      $('.heading-title')
        .first()
        .text()
        .replace(/\s+/g, ' ')
        .trim();

    // ========================================
    // ABSTRACT EXTRACTION
    // ========================================

    const abstract =

      $('.abstract-content')
        .text()
        .replace(/\s+/g, ' ')
        .trim();

    // ========================================
    // AUTHOR EXTRACTION
    // ========================================

    let author =
      'PubMed Research Article';

    const authors = [];

    $('.authors-list .full-name')
      .each((index, element) => {

        authors.push(
          $(element)
            .text()
            .trim()
        );
      });

    if (authors.length > 0) {

      author =
        authors.join(', ');
    }

    // ========================================
    // DATE EXTRACTION
    // ========================================

    let publishedDate = null;

    const citationText =

      $('.cit')
        .text()
        .trim();

    const yearMatch =

      citationText.match(/\d{4}/);

    if (yearMatch) {

      publishedDate =
        `${yearMatch[0]}-01-01`;
    }

    return {

      source_url: url,

      source_type: 'pubmed',

      title,

      author,

      published_date:
        publishedDate,

      text: abstract
    };

  } catch (error) {

    throw new Error(

      `PubMed scraping failed: ${error.message}`
    );
  }
};