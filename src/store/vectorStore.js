export const vectorStore = [];

// ========================================
// ADD EMBEDDING
// ========================================

export const addEmbedding = (
  embedding
) => {

  vectorStore.push(embedding);
};

// ========================================
// GET ALL EMBEDDINGS
// ========================================

export const getAllEmbeddings =
  () => {

    return vectorStore;
  };

// ========================================
// CLEAR VECTOR STORE
// ========================================

export const clearVectorStore =
  () => {

    vectorStore.length = 0;
  };