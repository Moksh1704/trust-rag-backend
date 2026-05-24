import express from 'express';

import { scrapeBlog } from '../scrapers/blogScraper.js';
import { scrapeYouTube } from '../scrapers/youtubeScraper.js';
import { scrapePubMed } from '../scrapers/pubmedScraper.js';

import { chunkText } from '../services/chunker.js';
import { extractTags } from '../services/tagger.js';
import { calculateTrustScore } from '../services/trustScorer.js';
import { enrichMetadata } from '../services/metadataEnricher.js';
import { deduplicateText } from '../services/deduplicator.js';
import { buildRetrievalMetadata } from '../services/retrievalMetadata.js';
import { prepareEmbeddings } from '../services/embeddingPreparer.js';
import { validateURL } from '../utils/urlValidator.js';


import { addEmbeddings } from '../store/vectorStore.js';

import { asyncHandler, ApiError } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/', (req, res) => {

  res.json({
    message:
      'Scrape API working. Use POST request.'
  });
});

router.post('/',
  asyncHandler(async (req, res) => {

    const { url } = req.body;

    if (!url) {

      throw new ApiError(
        400,
        'URL is required'
      );
    }

    // SSRF-safe URL validation
    await validateURL(url);

    let scrapedData;

    // YouTube source
    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    ) {

      scrapedData =
        await scrapeYouTube(url);

    // PubMed source
    } else if (
      url.includes(
        'pubmed.ncbi.nlm.nih.gov'
      )
    ) {

      scrapedData =
        await scrapePubMed(url);

    // Default blog source
    } else {

      scrapedData =
        await scrapeBlog(url);
    }

    // Deduplicate BEFORE chunking
    scrapedData.text =
      deduplicateText(scrapedData.text);

    const contentChunks =
      chunkText(scrapedData.text);

    const topicTags =
      extractTags(scrapedData.text);

    const retrievalMetadata =
      buildRetrievalMetadata(
        scrapedData,
        topicTags
      );

    const embeddingObjects =
      await prepareEmbeddings(
        contentChunks,
        retrievalMetadata,
        topicTags
      );

     await addEmbeddings(
  embeddingObjects
); 

    const enrichedMetadata =
      enrichMetadata(scrapedData);

    const trustScore =
      calculateTrustScore({
        ...scrapedData,
        topic_tags: topicTags,
        content_chunks: contentChunks
      });

    const response = {

      source_url:
        scrapedData.source_url,

      source_type:
        scrapedData.source_type,

      author:
        scrapedData.author,

      published_date:
        scrapedData.published_date,

      language:
        enrichedMetadata.language,

      region:
        enrichedMetadata.region,

      reading_time:
        enrichedMetadata.reading_time,

      content_length:
        enrichedMetadata.content_length,

      retrieval_metadata:
        retrievalMetadata,

      embedding_objects:
        embeddingObjects,

      topic_tags:
        topicTags,

      trust_score:
        trustScore,

      content_chunks:
        contentChunks
    };

    res.json(response);
  })
);

export default router;