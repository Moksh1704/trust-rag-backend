const vectorStore = [];

export function addEmbeddings(
  embeddingObjects
) {

  vectorStore.push(
    ...embeddingObjects
  );
}

export function getAllEmbeddings() {

  return vectorStore;
}

export function clearVectorStore() {

  vectorStore.length = 0;
}