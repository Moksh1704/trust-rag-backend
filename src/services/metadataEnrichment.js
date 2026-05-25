export const enrichMetadata = (
  data
) => {

  const text =
    data.text?.toLowerCase() || '';

  // ========================================
  // TOPIC TAGGING
  // ========================================

  const topicMap = {

    AI: [
      'machine learning',
      'artificial intelligence',
      'neural network',
      'deep learning',
      'llm'
    ],

    Cybersecurity: [
      'malware',
      'phishing',
      'cyber attack',
      'encryption',
      'hacking'
    ],

    Medicine: [
      'patient',
      'tumor',
      'clinical',
      'treatment',
      'disease',
      'medical',
      'surgery',
      'hospital'
    ],

    Neurology: [
      'brain',
      'stroke',
      'syncope',
      'neurological'
    ],

    Cardiology: [
      'cardiac',
      'heart',
      'mitral',
      'echocardiography'
    ],

    WebDevelopment: [
      'javascript',
      'frontend',
      'backend',
      'api',
      'web server'
    ],

    NodeJS: [
      'node.js',
      'node',
      'npm',
      'express',
      'event emitter',
      'runtime environment'
    ],

    Programming: [
      'function',
      'class',
      'module',
      'javascript',
      'coding',
      'programming'
    ]
  };

  const detectedTags = [];

  for (
    const [topic, keywords]
    of Object.entries(topicMap)
  ) {

    const matched =
      keywords.some(
        keyword =>
          text.includes(keyword)
      );

    if (matched) {

      detectedTags.push(topic);
    }
  }

  // ========================================
  // LANGUAGE DETECTION
  // ========================================

  const englishCharacters =

    (text.match(/[a-zA-Z]/g) || [])
      .length;

  const totalCharacters =
    text.length || 1;

  const englishRatio =
    englishCharacters /
    totalCharacters;

  const detectedLanguage =

    englishRatio > 0.4
      ? 'English'
      : 'Non-English';

  // ========================================
  // METADATA
  // ========================================

  return {

    ...data,

    metadata: {

      word_count:
        text.split(/\s+/).length,

      reading_time_minutes:

        Math.ceil(
          text.split(/\s+/).length / 200
        ),

      language:
        detectedLanguage,

      region:
        'Global',

      tags:
        detectedTags,

      processed_at:
        new Date().toISOString()
    }
  };
};