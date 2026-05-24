#  Trust Scraper — AI-Powered Semantic Retrieval & RAG Backend

**A modular Node.js backend for intelligent content ingestion, semantic embedding, and vector-based retrieval — built as a foundation for RAG (Retrieval-Augmented Generation) pipelines.**

---

##  Overview

**Trust Scraper** is a backend system that ingests content from web sources (blogs, PubMed research articles, YouTube transcripts), processes it through a multi-stage enrichment pipeline, generates local semantic embeddings using a HuggingFace transformer model, and stores them in an in-memory vector store for cosine similarity retrieval.

The system is designed with a clean, modular architecture that separates scraping, chunking, embedding, trust evaluation, and retrieval concerns into distinct services — making it straightforward to extend, swap components, or migrate to a persistent vector database like Qdrant.

Key design goals:
- **SSRF-safe** URL ingestion with DNS-level private IP blocking
- **Hierarchical chunking** using a parent/child strategy with configurable overlap
- **Local embeddings** — no external API calls required for the embedding pipeline
- **Trust scoring** on ingested content to surface credibility signals
- **Faithfulness & hallucination evaluation** endpoints for RAG quality measurement

---

##  Features

| Feature | Description |
|---|---|
|  **Multi-Source Scraping** | Blog HTML, PubMed XML via NCBI API, YouTube transcripts |
|  **SSRF Protection** | DNS lookup + private IP range blocking on all inbound URLs |
|  **Hierarchical Chunking** | Parent (1200 chars) / child (300 chars) with 50-char overlap |
|  **Local Embeddings** | `all-MiniLM-L6-v2` via `@xenova/transformers` — runs fully offline |
|  **Cosine Similarity Retrieval** | Custom vector search implementation over in-memory store |
|  **Keyword Tagging** | NLP-based keyword extraction via `keyword-extractor` |
|  **Hybrid Search** | Combined keyword + tag-based semantic search |
|  **Trust Scoring** | Rule-based credibility score on ingested documents |
|  **Faithfulness Evaluation** | Word-grounding score between answers and retrieved context |
|  **Hallucination Detection** | Out-of-context word rate for RAG answer evaluation |
|  **Vector Store Stats** | Live stats endpoint for monitoring the in-memory store |
|  **Qdrant-Ready Architecture** | Store abstraction designed to support persistent vector DBs |

---

##  System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        REST API Layer                           │
│   Express 5.x  •  CORS  •  Global Error Handler  •  ESM        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
         ┌──────────────────────▼──────────────────────┐
         │              Route Controllers               │
         │  /scrape  /retrieve  /search  /evaluate      │
         │  /faithfulness  /hallucination  /stats       │
         └──────────────────────┬──────────────────────┘
                                │
    ┌───────────────────────────▼────────────────────────────┐
    │                   Service Layer                        │
    │                                                        │
    │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
    │  │  Scrapers   │  │  Chunker     │  │  Tagger     │    │
    │  │  blog       │  │  parent/child│  │  keyword    │    │
    │  │  pubmed     │  │  with overlap│  │  extractor  │    │
    │  │  youtube    │  └──────────────┘  └─────────────┘    │
    │  └─────────────┘                                       │
    │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
    │  │  Embedding  │  │  VectorSearch│  │ TrustScorer │    │ 
    │  │  MiniLM-L6  │  │  cosine sim  │  │ rule-based  │    │
    │  │  384-dim    │  │  top-K sort  │  │ 0.0 – 1.0   │    │
    │  └─────────────┘  └──────────────┘  └─────────────┘    │
    │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
    │  │ Faithfulness│  │ Hallucination│  │  Metadata   │    │  
    │  │ Evaluator   │  │  Detector    │  │  Enricher   │    │
    │  └─────────────┘  └──────────────┘  └─────────────┘    │
    └───────────────────────────┬────────────────────────────┘
                                │
         ┌──────────────────────▼──────────────────────┐
         │         In-Memory Vector Store              │
         │   vectorStore[]  •  addEmbeddings()         │
         │   getAllEmbeddings()  •  clearVectorStore() │
         │                                             │
         │   Future: Qdrant persistent vector DB       │
         └─────────────────────────────────────────────┘
```

---

##  Retrieval Pipeline Flow

```
  URL Input
     │
     ▼
┌──────────────┐
│ URL Validator│  ← SSRF check, DNS lookup, private IP block
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Scraper    │  ← Route by source: blog / pubmed / youtube
│  (per type)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Deduplicator │  ← Sentence-level deduplication before chunking
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Chunker    │  ← Parent chunks (1200 chars) → child chunks (300 chars, 50 overlap)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Tagger    │  ← NLP keyword extraction (top 10 tags)
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ Retrieval Metadata │  ← source_type, domain, tag_count, ingestion_timestamp
└──────┬─────────────┘
       │
       ▼
┌──────────────────────┐
│  Embedding Preparer  │  ← Iterates child chunks → generateEmbedding() per chunk
│  (local MiniLM-L6)   │    UUID, chunk_type, text, vector, metadata
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│ Vector Store │  ← In-memory array; addEmbeddings() push
└──────┬───────┘
       │
       ▼  (at query time)
┌──────────────────────┐
│  Query Embedding     │  ← Same model generates query vector
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Cosine Similarity   │  ← Scored against all stored vectors
│  Ranking (top-K)     │
└──────┬───────────────┘
       │
       ▼
  Retrieved Chunks + Similarity Scores + Metadata
```

---

##  Folder Structure

```
trust-scraper/
├── src/
│   ├── app.js                        # Express app setup, middleware, routing
│   ├── server.js                     # Entry point — binds to PORT 3000
│   │
│   ├── routes/
│   │   ├── index.js                  # Central route registry
│   │   ├── scrape.js                 # POST /api/scrape — full ingestion pipeline
│   │   ├── retrieve.js               # POST /api/retrieve — semantic vector retrieval
│   │   ├── search.js                 # POST /api/search — hybrid keyword+tag search
│   │   ├── evaluate.js               # POST /api/evaluate — retrieval precision scoring
│   │   ├── faithfulness.js           # POST /api/faithfulness — answer grounding
│   │   ├── hallucination.js          # POST /api/hallucination — out-of-context detection
│   │   ├── stats.js                  # GET  /api/stats — vector store snapshot
│   │   └── health.js                 # GET  /api/health — liveness check
│   │
│   ├── scrapers/
│   │   ├── blogScraper.js            # Cheerio-based HTML scraper (og:meta + article/p)
│   │   ├── pubmedScraper.js          # NCBI eFetch XML scraper via xml2js
│   │   └── youtubeScraper.js         # Transcript fetch via youtube-transcript
│   │
│   ├── services/
│   │   ├── chunker.js                # Hierarchical parent/child chunking with overlap
│   │   ├── deduplicator.js           # Sentence-level deduplication (Set-based)
│   │   ├── embeddingPreparer.js      # Iterates chunks → builds embedding objects
│   │   ├── localEmbedding.js         # HuggingFace pipeline (all-MiniLM-L6-v2, 384-dim)
│   │   ├── vectorSearch.js           # Cosine similarity implementation + top-K sort
│   │   ├── searchEngine.js           # Hybrid keyword + semantic tag search
│   │   ├── tagger.js                 # NLP keyword extraction (top 10, deduplicated)
│   │   ├── trustScorer.js            # Rule-based trust score (0.0–1.0)
│   │   ├── metadataEnricher.js       # Reading time, content length, region inference
│   │   ├── retrievalMetadata.js      # Builds per-document retrieval metadata object
│   │   ├── retrievalEvaluator.js     # Keyword-match precision scoring
│   │   ├── faithfulnessEvaluator.js  # Word-grounding score for RAG answers
│   │   └── hallucinationDetector.js  # Out-of-context word rate > 0.3 = hallucinated
│   │
│   ├── store/
│   │   └── vectorStore.js            # In-memory vector store (module-level array)
│   │
│   └── utils/
│       ├── urlValidator.js           # SSRF protection — DNS + private IP checks
│       └── errorHandler.js           # ApiError class + asyncHandler + globalErrorHandler
│
├── package.json
└── package-lock.json
```

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ESM — `"type": "module"`) |
| **Framework** | Express 5.x |
| **Embedding Model** | `@xenova/transformers` — `Xenova/all-MiniLM-L6-v2` (384-dim, runs locally via ONNX) |
| **HTML Scraping** | Cheerio 1.x |
| **HTTP Client** | Axios |
| **YouTube Transcripts** | `youtube-transcript` |
| **PubMed XML Parsing** | `xml2js` |
| **Keyword Extraction** | `keyword-extractor` |
| **Vector DB Client** | `@qdrant/js-client-rest` (installed, ready for migration) |
| **Dev Server** | nodemon |
| **Config** | dotenv |

---

##  Backend Architecture Explanation

The backend follows a **layered, service-oriented architecture** with clear separation of concerns:

**Entry & Transport Layer** — `server.js` boots the app on port 3000. `app.js` configures CORS, JSON body parsing, mounts all routes under `/api`, and registers the global error handler last (as required by Express).

**Route Layer** — Each route file handles one concern (scrape, retrieve, search, evaluate). Routes validate required fields, delegate entirely to service functions, and format the HTTP response. No business logic lives in routes.

**Service Layer** — All domain logic lives here. Services are pure functions or small stateless modules. The embedding service (`localEmbedding.js`) is the only stateful service — it loads the ONNX model once at module initialization using a top-level `await`, ensuring the model is ready before any request hits the pipeline.

**Store Layer** — `vectorStore.js` is a module-level array acting as the in-memory vector store. It exposes `addEmbeddings`, `getAllEmbeddings`, and `clearVectorStore`. This thin abstraction is intentionally designed to be swapped for a Qdrant client (the `@qdrant/js-client-rest` package is already installed as a dependency).

**Utility Layer** — `errorHandler.js` provides an `asyncHandler` wrapper that catches Promise rejections and forwards them to the global error handler, eliminating repetitive try/catch in routes. `urlValidator.js` performs SSRF protection before any network request is made.

---

##  Embedding Pipeline

Embeddings are generated locally using the **`Xenova/all-MiniLM-L6-v2`** model via `@xenova/transformers`, which wraps the model in ONNX Runtime — no Python, no GPU, no external API calls required.

**Model characteristics:**
- Embedding dimensions: **384**
- Pooling strategy: **mean pooling**
- Normalization: **L2 normalized** (`normalize: true`)
- Loaded once at module initialization with a top-level `await pipeline(...)` call

**Pipeline execution:**

```
Child chunk text
      │
      ▼
extractor(text, { pooling: 'mean', normalize: true })
      │
      ▼
Float32Array (384 dimensions)
      │
      ▼
Array.from(output.data)  ←  stored as plain JS array in the vector store
```

Each child chunk gets its own embedding object containing:

```json
{
  "embedding_id": "uuid-v4",
  "chunk_type": "child",
  "text": "...",
  "embedding_vector": [0.023, -0.187, ...],
  "metadata": {
    "parent_index": 0,
    "source_type": "blog",
    "domain": "example.com",
    "topic_tags": ["machine learning", "neural network"],
    "ingestion_timestamp": "2026-05-24T08:00:00.000Z"
  }
}
```

---

##  Semantic Retrieval System

At query time, the `/api/retrieve` endpoint:

1. Generates a **384-dimensional embedding** for the incoming query using the same `all-MiniLM-L6-v2` model
2. Loads **all stored embedding objects** from the in-memory vector store
3. Computes **cosine similarity** between the query vector and every stored chunk vector
4. Sorts results in **descending similarity order** and returns the top-K results (default: 5)

**Cosine similarity implementation** (`vectorSearch.js`):

```javascript
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, magnitudeA = 0, magnitudeB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct  += vecA[i] * vecB[i];
    magnitudeA  += vecA[i] * vecA[i];
    magnitudeB  += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
```

Each result includes the chunk text, its similarity score, and full retrieval metadata (source type, domain, tags, ingestion timestamp).

> **Vector store note:** The current implementation uses a **lightweight in-memory array** for development and prototyping. The `@qdrant/js-client-rest` package is installed and the store abstraction (`vectorStore.js`) is designed to be replaced with a Qdrant client for production use, enabling persistent, scalable vector storage.

---

##  Chunking Strategy

The chunker implements a **hierarchical parent/child strategy** — a pattern commonly used in production RAG systems to balance context preservation and retrieval precision.

| Parameter | Value |
|---|---|
| Parent chunk size | 1200 characters |
| Child chunk size | 300 characters |
| Overlap | 50 characters |

**Why hierarchical?** Child chunks are small enough to match precise queries with high similarity scores, while the parent chunk they belong to provides the broader semantic context needed for a complete answer.

**Word-boundary protection:** Each child chunk checks for the last space before the cut point and adjusts the slice accordingly, preventing mid-word truncation.

**Deduplication first:** Before chunking, the text is passed through `deduplicateText()`, which splits on sentence boundaries and uses a `Set` to remove repeated sentences — reducing noise in the embedding space.

**Chunk object structure:**

```json
{
  "parent_index": 0,
  "chunk_type": "parent",
  "parent_text": "Full parent text (up to 1200 chars)...",
  "child_chunks": [
    { "child_index": 0, "chunk_type": "child", "text": "First child chunk..." },
    { "child_index": 1, "chunk_type": "child", "text": "Second child chunk..." }
  ]
}
```

---

##  Metadata Enrichment

After scraping, two metadata passes run before the response is returned:

**Retrieval Metadata** (`retrievalMetadata.js`) — attached to every embedding object:

| Field | Source |
|---|---|
| `source_type` | Determined by scraper (blog / pubmed / youtube) |
| `domain` | Extracted from `new URL(source_url).hostname` |
| `tag_count` | Number of NLP-extracted keywords |
| `ingestion_timestamp` | ISO 8601 timestamp at time of scrape |

**Enriched Metadata** (`metadataEnricher.js`) — returned in the scrape response:

| Field | Source |
|---|---|
| `language` | Defaulted to `english` |
| `region` | Inferred from TLD (`.in` → india, `.uk` → uk, `.us` → usa) |
| `reading_time` | `ceil(wordCount / 200)` minutes |
| `content_length` | Character count of full extracted text |

---

##  Trust Scoring

The trust scorer assigns a credibility score between **0.0 and 1.0** using five equally-weighted signals (0.2 each):

| Signal | Condition |
|---|---|
| **Author presence** | `author` field is present and not `"Unknown"` |
| **Publication date** | `published_date` is not null |
| **Content depth** | Extracted text length > 1000 characters |
| **Topic coverage** | ≥ 5 NLP-extracted topic tags |
| **Chunk density** | ≥ 3 parent content chunks generated |

A score of `1.0` indicates a well-attributed, substantive, topically rich document. Scores below `0.6` suggest the content may be thin, unattributed, or poorly structured for RAG use.

---

##  API Endpoints

### `GET /api/health`
Liveness check.

---

### `POST /api/scrape`
Full ingestion pipeline: scrape → deduplicate → chunk → tag → embed → store.

**Request:**
```json
{ "url": "https://example.com/article" }
```

**Supported URL types:** Any public blog/article, `pubmed.ncbi.nlm.nih.gov/*`, `youtube.com/watch?v=*`, `youtu.be/*`

---

### `POST /api/retrieve`
Semantic vector retrieval using cosine similarity.

**Request:**
```json
{ "query": "your search query", "top_k": 5 }
```

---

### `POST /api/search`
Hybrid keyword + tag-based search over provided chunks.

**Request:**
```json
{
  "chunks": [...],
  "query": "search term",
  "query_tags": ["tag1", "tag2"]
}
```

---

### `POST /api/evaluate`
Retrieval precision: what fraction of returned chunks contain expected keywords.

**Request:**
```json
{
  "results": [...],
  "expected_keywords": ["keyword1", "keyword2"]
}
```

---

### `POST /api/faithfulness`
Measures what fraction of answer words are grounded in retrieved context.

**Request:**
```json
{
  "answer": "The model uses attention mechanisms...",
  "retrieved_chunks": [{ "text": "..." }]
}
```

---

### `POST /api/hallucination`
Flags answer words (> 3 chars) not found in any retrieved chunk. Rate > 0.3 → `hallucination_detected: true`.

**Request:**
```json
{
  "answer": "The model uses attention mechanisms...",
  "retrieved_chunks": [{ "text": "..." }]
}
```

---

### `GET /api/stats`
Returns a snapshot of the in-memory vector store.

---

##  Installation

**Prerequisites:** Node.js ≥ 18 (required for top-level `await` and ESM)

```bash
# Clone the repository
git clone https://github.com/your-username/trust-scraper.git
cd trust-scraper

# Install dependencies
npm install
```

> On first run, `@xenova/transformers` will download the `all-MiniLM-L6-v2` ONNX model (~25 MB) and cache it locally.

---

##  Environment Setup

Create a `.env` file in the project root:

```env
# Server port (defaults to 3000 if not set)
PORT=3000
```

No external API keys are required. The embedding model runs fully locally via ONNX Runtime.

---

##  Running Locally

```bash
# Production mode
npm start

# Development mode (auto-restart with nodemon)
npm run dev
```

Server starts at: `http://localhost:3000`

---

##  Example API Requests

### Scrape a blog article

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://simonwillison.net/2024/Jan/2/what-is-retrieval-augmented-generation/"}'
```

### Semantic retrieval

```bash
curl -X POST http://localhost:3000/api/retrieve \
  -H "Content-Type: application/json" \
  -d '{"query": "how does RAG improve LLM accuracy", "top_k": 3}'
```

### Vector store stats

```bash
curl http://localhost:3000/api/stats
```

### Hallucination detection

```bash
curl -X POST http://localhost:3000/api/hallucination \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "RAG uses quantum entanglement to retrieve documents faster.",
    "retrieved_chunks": [
      {"text": "Retrieval-Augmented Generation grounds LLM responses in external documents."},
      {"text": "The retrieval step uses dense vector search to find relevant context."}
    ]
  }'
```

### Faithfulness evaluation

```bash
curl -X POST http://localhost:3000/api/faithfulness \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Dense vector retrieval finds relevant context for the model.",
    "retrieved_chunks": [
      {"text": "The retrieval step uses dense vector search to find relevant context."}
    ]
  }'
```

---

## 📋 Example JSON Responses

### `POST /api/scrape` — Success

```json
{
  "source_url": "https://example.com/article-on-rag",
  "source_type": "blog",
  "author": "Jane Smith",
  "published_date": "2024-03-15T00:00:00.000Z",
  "language": "english",
  "region": "global",
  "reading_time": 4,
  "content_length": 5230,
  "retrieval_metadata": {
    "source_type": "blog",
    "domain": "example.com",
    "tag_count": 8,
    "ingestion_timestamp": "2026-05-24T08:00:00.000Z"
  },
  "embedding_objects": [
    {
      "embedding_id": "3f7a2c91-84b1-4e6a-b3d2-2f1e9c0d4a78",
      "chunk_type": "child",
      "text": "Retrieval-Augmented Generation combines a retrieval step with a language model to ground responses in factual documents.",
      "embedding_vector": [0.023, -0.187, 0.054, "...383 more values..."],
      "metadata": {
        "parent_index": 0,
        "source_type": "blog",
        "domain": "example.com",
        "topic_tags": ["retrieval", "language model", "document", "generation", "rag"],
        "ingestion_timestamp": "2026-05-24T08:00:00.000Z"
      }
    }
  ],
  "topic_tags": ["retrieval", "language model", "document", "generation", "rag", "vector", "embedding", "context"],
  "trust_score": 0.8,
  "content_chunks": [
    {
      "parent_index": 0,
      "chunk_type": "parent",
      "parent_text": "Retrieval-Augmented Generation...",
      "child_chunks": [
        { "child_index": 0, "chunk_type": "child", "text": "Retrieval-Augmented Generation combines..." },
        { "child_index": 1, "chunk_type": "child", "text": "...grounding responses in factual documents" }
      ]
    }
  ]
}
```

---

### `POST /api/retrieve` — Semantic Retrieval Response

```json
{
  "query": "how does RAG improve LLM accuracy",
  "retrieved_chunks": [
    {
      "text": "Retrieval-Augmented Generation combines a retrieval step with a language model to ground responses in factual documents, significantly reducing hallucination.",
      "metadata": {
        "parent_index": 0,
        "source_type": "blog",
        "domain": "example.com",
        "topic_tags": ["retrieval", "language model", "rag", "hallucination"],
        "ingestion_timestamp": "2026-05-24T08:00:00.000Z"
      },
      "similarity_score": 0.8923
    },
    {
      "text": "By injecting retrieved passages into the prompt, RAG allows the model to answer accurately even for questions outside its training data.",
      "metadata": {
        "parent_index": 1,
        "source_type": "blog",
        "domain": "example.com",
        "topic_tags": ["retrieval", "prompt", "training"],
        "ingestion_timestamp": "2026-05-24T08:00:00.000Z"
      },
      "similarity_score": 0.8541
    }
  ],
  "retrieval_count": 2,
  "retrieval_timestamp": "2026-05-24T08:05:32.000Z"
}
```

---

### `GET /api/stats` — Vector Store Snapshot

```json
{
  "vector_store_type": "In-Memory Vector Store",
  "total_vectors": 42,
  "parent_chunks": 6,
  "child_chunks": 36,
  "embedding_model": "Xenova all-MiniLM-L6-v2",
  "embedding_dimensions": 384,
  "retrieval_system": "Semantic Cosine Similarity",
  "semantic_search_enabled": true,
  "retrieval_route": "/api/retrieve",
  "memory_usage_estimate": "Lightweight",
  "active_queries_supported": true,
  "status": "active"
}
```

---

### `POST /api/hallucination` — Detection Response

```json
{
  "hallucinated_words": ["quantum", "entanglement", "faster"],
  "hallucination_rate": 0.43,
  "hallucination_detected": true
}
```

---

### `POST /api/faithfulness` — Grounding Response

```json
{
  "grounded_words": 9,
  "total_answer_words": 11,
  "faithfulness_score": 0.82
}
```

---

##  Future Improvements

- **Qdrant integration** — Swap the in-memory store for the already-installed `@qdrant/js-client-rest` client to enable persistent, production-grade vector storage with filtering, namespacing, and scalable ANN search
- **Rate limiting** — Add `express-rate-limit` on the `/api/scrape` endpoint to prevent abuse
- **Batch ingestion** — Accept arrays of URLs in `/api/scrape` and process with concurrency control
- **Metadata filtering at retrieval time** — Allow `source_type`, `domain`, or `topic_tags` filters in `/api/retrieve` queries
- **Streaming responses** — Stream embedding progress for large documents using Server-Sent Events
- **Persistent deduplication** — Track ingested URLs in a Redis set or SQLite to prevent re-scraping
- **Reranking** — Add a cross-encoder reranking pass over the top-K results for improved precision
- **Authentication** — Add JWT or API key middleware for production deployment
- **Docker support** — Containerize the app with a multi-stage Dockerfile including model caching

---

##  Learning Outcomes

Building this system provides hands-on experience with:

- Architecting a **RAG ingestion and retrieval pipeline** end to end
- Running **transformer embeddings locally** with `@xenova/transformers` and ONNX Runtime
- Implementing **cosine similarity search** from scratch without a vector DB
- Designing a **hierarchical chunking strategy** that balances granularity and context
- Writing **SSRF-safe** URL validation with DNS-level private IP detection
- Structuring a **modular Express backend** with clean separation of routes, services, and utilities
- Building **RAG quality evaluation** primitives: faithfulness scoring and hallucination detection

---


Built with curiosity and a healthy skepticism of hallucinations.

</div>
