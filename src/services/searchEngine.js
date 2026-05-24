export function keywordSearch(chunks, query) {

  const lowerQuery =
    query.toLowerCase();

  return chunks.filter(chunk =>
    chunk.text
      .toLowerCase()
      .includes(lowerQuery)
  );
}

export function semanticSearch(
  chunks,
  queryTags
) {

  return chunks.filter(chunk => {

    const chunkText =
      chunk.text.toLowerCase();

    return queryTags.some(tag =>
      chunkText.includes(tag.toLowerCase())
    );
  });
}

export function hybridSearch(
  chunks,
  query,
  queryTags
) {

  const keywordResults =
    keywordSearch(chunks, query);

  const semanticResults =
    semanticSearch(chunks, queryTags);

  // Merge unique results
  const combined =
    [...keywordResults, ...semanticResults];

  return combined.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        t => t.text === item.text
      )
  );
}