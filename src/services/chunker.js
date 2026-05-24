const PARENT_CHUNK_SIZE = 1200;
const CHILD_CHUNK_SIZE = 300;
const OVERLAP = 50;

export function chunkText(text) {

  if (!text) return [];

  const parentChunks = [];

  let parentStart = 0;

  // Create parent chunks
  while (parentStart < text.length) {

    const parentEnd =
      parentStart + PARENT_CHUNK_SIZE;

    const parentText =
      text.slice(parentStart, parentEnd).trim();

    const childChunks = [];

    let childStart = 0;

    // Create child chunks inside parent
    while (childStart < parentText.length) {

      const childEnd =
        childStart + CHILD_CHUNK_SIZE;

      // Initial slice
      let chunkText =
        parentText.slice(childStart, childEnd);

      // Prevent mid-word cutting
      const lastSpace =
        chunkText.lastIndexOf(' ');

      if (lastSpace > 0) {
        chunkText =
          chunkText.slice(0, lastSpace);
      }

      childChunks.push({
        child_index: childChunks.length,
        chunk_type: 'child',
        text: chunkText.trim()
      });

      childStart +=
        CHILD_CHUNK_SIZE - OVERLAP;
    }

    parentChunks.push({
      parent_index: parentChunks.length,
      chunk_type: 'parent',
      parent_text: parentText,
      child_chunks: childChunks
    });

    parentStart +=
      PARENT_CHUNK_SIZE - OVERLAP;
  }

  return parentChunks;
}