import express from 'express';

import {
  getAllEmbeddings
} from '../store/vectorStore.js';

import {
  generateEmbedding
} from '../services/localEmbedding.js';

import {
  vectorSearch
} from '../services/vectorSearch.js';

const router =
  express.Router();

router.post(
  '/',
  async (req, res) => {

    try {

      const {
        query,
        top_k = 5
      } = req.body;

      if (!query) {

        return res.status(400).json({

          message:
            'Query is required'
        });
      }

      const embeddingObjects =
        getAllEmbeddings();

      if (
        embeddingObjects.length === 0
      ) {

        return res.status(400).json({

          message:
            'No embeddings found. Scrape content first.'
        });
      }

      const queryVector =
        await generateEmbedding(
          query
        );

      const results =
        vectorSearch(
          embeddingObjects,
          queryVector,
          top_k
        );

      res.json({

        query,

        retrieved_chunks:
          results,

        retrieval_count:
          results.length,

        retrieval_timestamp:
          new Date()
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message
      });
    }
  }
);

export default router;