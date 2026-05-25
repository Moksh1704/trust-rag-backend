import { pipeline } from '@xenova/transformers';

let extractor = null;

const getExtractor = async () => {

  if (!extractor) {

    extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  return extractor;
};

export const generateEmbeddings = async (
  chunks,
  metadata = {}
) => {

  const extractor =
    await getExtractor();

  const embeddedChunks = [];

  for (const chunk of chunks) {

    const output =
      await extractor(chunk, {

        pooling: 'mean',
        normalize: true
      });

    embeddedChunks.push({

      text: chunk,

      embedding:
        Array.from(output.data),

      metadata
    });
  }

  return embeddedChunks;
};