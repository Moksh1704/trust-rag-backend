import crypto from 'crypto';

import {
  generateEmbedding
} from './localEmbedding.js';

export async function prepareEmbeddings(
  contentChunks,
  retrievalMetadata,
  topicTags
) {

  const embeddingObjects = [];

  for (const parentChunk of contentChunks) {

    for (
      const childChunk
      of parentChunk.child_chunks
    ) {

      // REAL OpenAI embedding
      const embedding =
        await generateEmbedding(
          childChunk.text
        );

      embeddingObjects.push({

        embedding_id:
          crypto.randomUUID(),

        chunk_type:
          childChunk.chunk_type,

        text:
          childChunk.text,

        embedding_vector:
          embedding,

        metadata: {

          parent_index:
            parentChunk.parent_index,

          source_type:
            retrievalMetadata.source_type,

          domain:
            retrievalMetadata.domain,

          topic_tags:
            topicTags,

          ingestion_timestamp:
            retrievalMetadata
              .ingestion_timestamp
        }
      });
    }
  }

  return embeddingObjects;
}0