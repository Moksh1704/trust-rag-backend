export const chunkText = (
  text,
  parentSize = 1000,
  childSize = 200,
  overlap = 50
) => {

  if (!text) {

    return [];
  }

  const words =
    text.split(/\s+/);

  const parentChunks = [];

  // ========================================
  // PARENT CHUNKING
  // ========================================

  for (

    let i = 0;

    i < words.length;

    i += (parentSize - overlap)

  ) {

    const parentText =

      words
        .slice(i, i + parentSize)
        .join(' ');

    // ========================================
    // SKIP VERY SMALL PARENT CHUNKS
    // ========================================

    if (

      parentText
        .split(/\s+/)
        .length < 50

    ) {

      continue;
    }

    const parentWords =
      parentText.split(/\s+/);

    const childChunks = [];

    // ========================================
    // CHILD CHUNKING
    // ========================================

    for (

      let j = 0;

      j < parentWords.length;

      j += (childSize - overlap)

    ) {

      const childText =

        parentWords
          .slice(j, j + childSize)
          .join(' ');

      // ========================================
      // SKIP TINY CHILD CHUNKS
      // ========================================

      if (

        childText
          .split(/\s+/)
          .length < 30

      ) {

        continue;
      }

      childChunks.push({

        child_id:
          `${parentChunks.length + 1}_${childChunks.length + 1}`,

        text: childText,

        word_count:
          childText
            .split(/\s+/)
            .length
      });
    }

    parentChunks.push({

      parent_id:
        parentChunks.length + 1,

      text: parentText,

      word_count:
        parentText
          .split(/\s+/)
          .length,

      child_chunks:
        childChunks
    });
  }

  return parentChunks;
};