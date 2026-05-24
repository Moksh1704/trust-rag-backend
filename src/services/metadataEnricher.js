export function enrichMetadata(scrapedData) {

  const metadata = {
    language: 'english',
    region: 'global',
    reading_time: 0,
    content_length: 0
  };

  // Content length
  metadata.content_length = scrapedData.text.length;

  // Estimated reading time
  metadata.reading_time = Math.ceil(
    scrapedData.text.split(' ').length / 200
  );

  // Region inference
  if (scrapedData.source_url.includes('.in')) {
    metadata.region = 'india';
  }

  if (scrapedData.source_url.includes('.uk')) {
    metadata.region = 'uk';
  }

  if (scrapedData.source_url.includes('.us')) {
    metadata.region = 'usa';
  }

  return metadata;
}