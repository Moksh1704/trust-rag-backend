function cosineSimilarity(
  vecA,
  vecB
) {

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (
    let i = 0;
    i < vecA.length;
    i++
  ) {

    dotProduct +=
      vecA[i] * vecB[i];

    magnitudeA +=
      vecA[i] * vecA[i];

    magnitudeB +=
      vecB[i] * vecB[i];
  }

  magnitudeA =
    Math.sqrt(magnitudeA);

  magnitudeB =
    Math.sqrt(magnitudeB);

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (magnitudeA * magnitudeB)
  );
}

export function vectorSearch(
  embeddingObjects,
  queryVector,
  topK = 3
) {

  const scoredResults =
    embeddingObjects.map(item => {

      const similarity =
        cosineSimilarity(
          queryVector,
          item.embedding_vector
        );

      return {

        text: item.text,

        metadata:
          item.metadata,

        similarity_score:
          similarity
      };
    });

  scoredResults.sort(
    (a, b) =>
      b.similarity_score -
      a.similarity_score
  );

  return scoredResults.slice(
    0,
    topK
  );
}