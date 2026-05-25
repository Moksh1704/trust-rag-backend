import express from 'express';
import fs from 'fs';
import path from 'path';

import { scrapeBlog } from '../scrapers/blogScraper.js';
import { scrapeYouTube } from '../scrapers/youtubeScraper.js';
import { scrapePubMed } from '../scrapers/pubmedScraper.js';

import { chunkText } from '../services/chunkText.js';
import { generateEmbeddings } from '../services/embeddingService.js';
import { storeEmbeddings } from '../services/storeEmbeddings.js';

import { calculateTrustScore } from '../services/trustScore.js';
import { enrichMetadata } from '../services/metadataEnrichment.js';

const router = express.Router();

// ========================================
// GET ROUTE
// ========================================

router.get('/', (req, res) => {

  res.json({

    success: true,
    message: 'Scrape API is working'
  });
});

// ========================================
// POST ROUTE
// ========================================

router.post('/', async (req, res) => {

  try {

    const { url } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!url) {

      return res.status(400).json({

        success: false,
        error: 'URL is required'
      });
    }

    let scrapedData;

    // ========================================
    // SCRAPER SELECTION
    // ========================================

    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    ) {

      scrapedData =
        await scrapeYouTube(url);

    } else if (
      url.includes('pubmed')
    ) {

      scrapedData =
        await scrapePubMed(url);

    } else {

      scrapedData =
        await scrapeBlog(url);
    }

    // ========================================
    // METADATA ENRICHMENT
    // ========================================

    scrapedData =
      enrichMetadata(scrapedData);

    // ========================================
    // TRUST SCORING
    // ========================================

    const trustData =
      calculateTrustScore(scrapedData);

    scrapedData.trust_score =
      trustData.trust_score;

    scrapedData.trust_breakdown =
      trustData.trust_breakdown;

    // ========================================
    // PARENT-CHILD CHUNKING
    // ========================================

    const parentChunks =
      chunkText(
        scrapedData.text || ''
      );

    scrapedData.parent_chunks =
      parentChunks;

    // ========================================
    // FLATTEN CHILD CHUNKS
    // ========================================

    const childChunks =
      parentChunks.flatMap(
        parent =>
          parent.child_chunks
      );

    // ========================================
    // EMBEDDING GENERATION
    // ========================================

    const embeddedChunks =
      await generateEmbeddings(

        childChunks.map(
          chunk => chunk.text
        ),

        scrapedData
      );

    // ========================================
    // VECTOR STORAGE
    // ========================================

    storeEmbeddings(
      embeddedChunks
    );

    // ========================================
    // DETERMINE STORAGE FOLDER
    // ========================================

    let folder = 'blogs';

    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    ) {

      folder = 'youtube';
    }

    if (
      url.includes('pubmed')
    ) {

      folder = 'pubmed';
    }

    // ========================================
    // CREATE DIRECTORY
    // ========================================

    const outputDir = path.join(
      'scraped_data',
      folder
    );

    if (
      !fs.existsSync(outputDir)
    ) {

      fs.mkdirSync(
        outputDir,
        { recursive: true }
      );
    }

    // ========================================
    // SAFE FILE NAME
    // ========================================

    const safeTitle = (
      scrapedData.title ||
      'scraped_content'
    )
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .slice(0, 60);

    const fileName =
      `${safeTitle}_${Date.now()}.json`;

    // ========================================
    // FINAL FILE PATH
    // ========================================

    const filePath = path.join(
      outputDir,
      fileName
    );

    // ========================================
    // SAVE JSON FILE
    // ========================================

    fs.writeFileSync(

      filePath,

      JSON.stringify(
        scrapedData,
        null,
        2
      )
    );

    console.log(
      `JSON saved at: ${filePath}`
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({

      success: true,

      message:
        'Scraping completed successfully',

      saved_to: filePath,

      total_parent_chunks:
        parentChunks.length,

      total_child_chunks:
        childChunks.length,

      trust_score:
        scrapedData.trust_score,

      data: scrapedData
    });

  } catch (error) {

    console.error(
      'Scraping Error:',
      error
    );

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
});

export default router;