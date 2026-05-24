export function buildRetrievalMetadata(
  scrapedData,
  topicTags
) {

  return {
    source_type: scrapedData.source_type,
    domain: new URL(scrapedData.source_url).hostname,
    tag_count: topicTags.length,
    ingestion_timestamp: new Date().toISOString()
  };
}