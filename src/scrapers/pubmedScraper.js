import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function scrapePubMed(url) {

  try {

    // Extract PubMed ID
    const pubmedId = url.split('/').filter(Boolean).pop();

    if (!pubmedId) {
      throw new Error('Invalid PubMed URL');
    }

    // Fetch article XML
    const apiUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pubmedId}&retmode=xml`;

    const response = await axios.get(apiUrl);

    // Parse XML
    const parsed = await parseStringPromise(response.data);

    const article =
      parsed?.PubmedArticleSet?.PubmedArticle?.[0];

    const articleData =
      article?.MedlineCitation?.[0]?.Article?.[0];

    const title =
      articleData?.ArticleTitle?.[0] || 'Unknown Title';

    const abstractArray =
  articleData?.Abstract?.[0]?.AbstractText || [];

const abstract = abstractArray
  .map(item => {

    // If plain string
    if (typeof item === 'string') {
      return item;
    }

    // If XML object
    if (typeof item === 'object' && item._) {
      return item._;
    }

    return '';
  })
  .join(' ');

    return {
      source_url: url,
      source_type: 'pubmed',
      title,
      author: 'PubMed Research Article',
      published_date: null,
      text: abstract
    };

  } catch (error) {

    throw new Error(
      `PubMed scraping failed: ${error.message}`
    );
  }
}