export function deduplicateText(text) {

  if (!text) return '';

  // Split into sentences
  const sentences = text
    .split('.')
    .map(sentence => sentence.trim())
    .filter(Boolean);

  // Remove duplicates
  const uniqueSentences = [...new Set(sentences)];

  return uniqueSentences.join('. ');
}