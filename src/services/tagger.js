import keywordExtractor from 'keyword-extractor';

export function extractTags(text) {
  if (!text) return [];

  return keywordExtractor.extract(text, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  }).slice(0, 10);
}