import express from 'express';

import {
  getAllEmbeddings
} from '../store/vectorStore.js';

const router =
  express.Router();

router.get(
  '/',
  async (req, res) => {

    try {

      const embeddings =
        getAllEmbeddings();

      const totalChunks =
        embeddings.length;

      const parentChunks =
        embeddings.filter(
          item =>
            item.chunk_type ===
            'parent'
        ).length;

      const childChunks =
        embeddings.filter(
          item =>
            item.chunk_type ===
            'child'
        ).length;

      res.json({

  vector_store_type:
    'In-Memory Vector Store',

  total_vectors:
    totalChunks,

  parent_chunks:
    parentChunks,

  child_chunks:
    childChunks,

  embedding_model:
    'Xenova all-MiniLM-L6-v2',

  embedding_dimensions:
    384,

  retrieval_system:
    'Semantic Cosine Similarity',

  semantic_search_enabled:
    true,

  retrieval_route:
    '/api/retrieve',

  memory_usage_estimate:
    'Lightweight',

  active_queries_supported:
    true,

  status:
    'active'
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