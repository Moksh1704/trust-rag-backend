export function evaluateRetrieval(
  results,
  expectedKeywords
) {

  let matchedChunks = 0;

  for (const result of results) {

    const lowerText =
      result.text.toLowerCase();

    const matched =
      expectedKeywords.some(keyword =>
        lowerText.includes(
          keyword.toLowerCase()
        )
      );

    if (matched) {
      matchedChunks++;
    }
  }

const retrievalPrecision =
    matchedChunks / results.length;

 return {
  matched_chunks: matchedChunks,
  total_chunks: results.length,
  retrieval_precision:
    Number(
      retrievalPrecision.toFixed(2)
    )
};
}