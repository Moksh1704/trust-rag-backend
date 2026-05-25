import { vectorStore }
from '../store/vectorStore.js';

export const storeEmbeddings = (
  embeddedChunks
) => {

  embeddedChunks.forEach(item => {



    const exists =

      vectorStore.some(
        existing =>

          existing.text === item.text
      );

    if (!exists) {

      vectorStore.push(item);
    }
  });

  return true;
};