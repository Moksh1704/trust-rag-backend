import { pipeline } from '@xenova/transformers';

// Load embedding model once
const extractor = await pipeline(
  'feature-extraction',
  'Xenova/all-MiniLM-L6-v2'
);

export async function generateEmbedding(text) {

  const output =
    await extractor(text, {

      pooling: 'mean',
      normalize: true
    });

  return Array.from(output.data);
}