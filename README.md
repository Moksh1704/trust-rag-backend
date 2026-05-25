# Trust-Aware RAG Backend

A multi-source intelligent scraping and retrieval backend built using Node.js.  
The system extracts content from blogs, YouTube videos, and PubMed articles, enriches the data with metadata, performs hierarchical chunking, calculates trust scores, and stores structured JSON outputs for retrieval-based applications.

---

# Features

## Multi-source Scraping
- Blog articles
- YouTube transcripts
- PubMed research articles

## Metadata Enrichment
- Author extraction
- Published date extraction
- Language detection
- Topic tagging
- Reading time estimation

## Hierarchical Chunking
- Parent chunks
- Child chunks
- Overlapping semantic chunking

## Trust Score Calculation
- Author credibility
- Citation analysis
- Domain authority
- Recency analysis
- Medical disclaimer detection

## JSON Persistence
- Saves processed outputs locally
- Structured retrieval-ready format

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Scraping
- Axios
- Cheerio
- youtube-transcript

## Data Processing
- Custom chunking pipeline
- Metadata enrichment services
- Trust scoring engine

## Development Tools
- Nodemon
- dotenv

---

# Project Structure

```bash
src/
│
├── routes/
│   └── scrape.js
│
├── scrapers/
│   ├── blogScraper.js
│   ├── youtubeScraper.js
│   └── pubmedScraper.js
│
├── services/
│   ├── chunkText.js
│   ├── trustScore.js
│   ├── metadataEnrichment.js
│   ├── embeddingService.js
│   └── storeEmbeddings.js
│
├── store/
│   └── vectorStore.js
│
└── server.js
```

---

# Scraping Approach

## Blogs
- Extracts article content using structured HTML parsing
- Cleans navigation bars, ads, scripts, and irrelevant content
- Supports structured extraction from modern websites

## YouTube
- Extracts video transcripts using transcript APIs
- Retrieves metadata such as title, author, and publish date

## PubMed
- Extracts research article abstracts and metadata
- Handles medical and research-oriented content

---

# Trust Score Design

The trust score ranges from:

- `0` → Low Trust
- `1` → High Trust

## Scoring Function

```text
Trust Score =
f(
  author_credibility,
  citation_count,
  domain_authority,
  recency,
  medical_disclaimer_presence
)
```

## Factors Considered

### Author Credibility
Checks whether valid author metadata exists.

### Citation Count
Detects references such as:
- DOI
- PMID
- Citation patterns

### Domain Authority
Evaluates source reliability using generalized domain categorization.

### Recency
Newer content receives higher trust values.

### Medical Disclaimer Detection
Detects presence of medical disclaimers in healthcare-related content.

---

# Hierarchical Chunking

The system performs:

## Parent Chunking
Large semantic sections for high-level retrieval.

## Child Chunking
Smaller overlapping chunks for precise retrieval.

## Benefits
- Improved semantic search
- Better retrieval quality
- Enhanced embedding relevance

---

# Output Format

Processed data is saved as structured JSON:

```json
{
  "source_url": "...",
  "source_type": "...",
  "title": "...",
  "author": "...",
  "published_date": "...",
  "trust_score": 0.54,
  "metadata": {},
  "parent_chunks": []
}
```

---

# Limitations

- Some websites may block scraping requests
- YouTube transcript availability depends on transcript settings
- Dynamic JavaScript-rendered websites may require headless browser support
- Trust scoring uses heuristic-based estimation and is not a factual verification system

---

# How to Run

## 1. Clone Repository

```bash
git clone <repo-url>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:3000
```

---

# Sample API Endpoint

## Scrape Content

### Endpoint

```http
POST /api/scrape
```

### Request Body

```json
{
  "url": "https://example.com"
}
```

---

# Future Improvements

- Vector database integration
- Semantic retrieval API
- LLM-based trust analysis
- Headless browser scraping
- Real-time embedding generation
