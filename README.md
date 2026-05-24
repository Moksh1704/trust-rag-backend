# Trust RAG System – README.md

````md
# Trust RAG System

A lightweight semantic retrieval backend system that performs intelligent content ingestion, embedding generation, vector similarity search, and retrieval monitoring using AI embeddings and semantic search techniques.

---

## Features

### Content Ingestion
- Scrapes content from:
  - Blogs
  - Articles
  - Documentation pages
  - PubMed research papers
- Extracts metadata:
  - Author
  - Language
  - Reading time
  - Source URL
  - Content length
- Splits content into semantic chunks

### AI Embeddings
- Generates embeddings using:
  - Xenova `all-MiniLM-L6-v2`
- Stores embeddings in:
  - Lightweight in-memory vector store

### Semantic Retrieval
- Cosine similarity search
- Semantic query matching
- Retrieval scoring
- Top-k relevant chunk retrieval

### Monitoring & Statistics
- Vector statistics dashboard
- Embedding metadata
- Retrieval system metrics
- Chunk monitoring

### Frontend Dashboard
- Modern Next.js frontend
- JSON visualization
- Light-themed research dashboard UI
- Multi-page navigation:
  - Ingestion
  - Search
  - Stats

---

# Tech Stack

## Frontend
- Next.js 16
- React
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js

## AI / NLP
- Xenova Transformers
- all-MiniLM-L6-v2 embeddings

## Retrieval
- Semantic cosine similarity search
- In-memory vector database

---

# Project Structure

```bash
trust-rag-system/
│
├── trust-frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── trust-scraper/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── scraper/
│
└── README.md
````

---

# Installation

## 1. Clone Repository

```bash
git clone <repo-url>
cd trust-rag-system
```

---

# Backend Setup

## Navigate to Backend

```bash
cd trust-scraper
```

## Install Dependencies

```bash
npm install
```

## Start Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:3000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd trust-frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3001
```

---

# API Routes

## Scrape Content

### Endpoint

```http
POST /api/scrape
```

### Request Body

```json
{
  "url": "https://example.com/article"
}
```

---

## Semantic Retrieval

### Endpoint

```http
POST /api/retrieve
```

### Request Body

```json
{
  "query": "machine learning"
}
```

---

## Retrieval Statistics

### Endpoint

```http
GET /api/stats
```

---

# Frontend Pages

| Page      | Description                    |
| --------- | ------------------------------ |
| `/`       | Content ingestion & scraping   |
| `/search` | Semantic vector retrieval      |
| `/stats`  | Retrieval statistics dashboard |

---

# Example Workflow

## Step 1 – Ingest Content

* Open ingestion page
* Enter article or PubMed URL
* Generate embeddings

## Step 2 – Perform Semantic Search

* Navigate to search page
* Enter semantic query
* Retrieve relevant chunks

## Step 3 – Monitor Statistics

* Open stats page
* View vector and retrieval metrics

---

# Example Sources

## PubMed

```text
https://pubmed.ncbi.nlm.nih.gov/32705908/
```

## FreeCodeCamp

```text
https://www.freecodecamp.org/news/what-is-node-js/
```

## MDN

```text
https://developer.mozilla.org/en-US/docs/Web/JavaScript
```

---

# Future Improvements

* Persistent vector database
* Hybrid retrieval
* Hallucination detection
* PDF ingestion
* Multi-document retrieval
* RAG answer generation
* Authentication system
* Cloud deployment

---

# Learning Outcomes

This project demonstrates:

* Retrieval-Augmented Generation (RAG)
* Semantic search systems
* Embedding generation
* Vector similarity retrieval
* Metadata enrichment
* Full-stack AI application architecture

---

# Author

Sai Moksha Naimisha Namburu

---

# License

MIT License

```
```
