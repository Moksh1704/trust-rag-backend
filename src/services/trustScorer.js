export function calculateTrustScore(data) {
  let score = 0;

  if (data.author && data.author !== 'Unknown') {
    score += 0.2;
  }

  if (data.published_date) {
    score += 0.2;
  }

  if (data.text.length > 1000) {
    score += 0.2;
  }

  if (data.topic_tags.length >= 5) {
    score += 0.2;
  }

  if (data.content_chunks.length >= 3) {
    score += 0.2;
  }

  return Number(score.toFixed(2));
}