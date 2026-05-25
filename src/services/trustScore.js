export const calculateTrustScore = (
  data
) => {

  const text =
    data.text?.toLowerCase() || '';

  // ========================================
  // AUTHOR CREDIBILITY
  // ========================================

  let authorCredibility = 0.3;

  if (
    data.author &&
    data.author !== 'Unknown' &&
    data.author !== 'Unknown Author' &&
    data.author !== 'Unknown Channel'
  ) {

    authorCredibility = 0.8;
  }

  // ========================================
  // CITATION COUNT
  // ========================================

  const citationMatches =

    text.match(
      /\[\d+\]|\(\d{4}\)|doi|pmid/gi
    ) || [];

  const citationCount =
    citationMatches.length;

  let citationScore =

    Math.min(
      citationCount / 10,
      1
    );

  // ========================================
  // DOMAIN AUTHORITY
  // ========================================

  let domainAuthority = 0.5;

  const url =
    data.source_url || '';

  if (
    url.includes('.gov') ||
    url.includes('.edu')
  ) {

    domainAuthority = 0.9;
  }

  else if (
    url.includes('pubmed')
  ) {

    domainAuthority = 1.0;
  }

  else if (
    url.includes('youtube')
  ) {

    domainAuthority = 0.7;
  }

  else {

    domainAuthority = 0.6;
  }

  // ========================================
  // RECENCY SCORE
  // ========================================

  let recencyScore = 0.5;

  if (data.published_date) {

    const publishedYear =

      new Date(
        data.published_date
      ).getFullYear();

    const currentYear =
      new Date().getFullYear();

    const difference =
      currentYear - publishedYear;

    if (difference <= 1) {

      recencyScore = 1.0;
    }

    else if (difference <= 3) {

      recencyScore = 0.8;
    }

    else if (difference <= 5) {

      recencyScore = 0.7;
    }

    else if (difference <= 10) {

      recencyScore = 0.6;
    }

    else {

      recencyScore = 0.4;
    }
  }

  // ========================================
  // MEDICAL DISCLAIMER
  // ========================================

  const hasMedicalDisclaimer =

    text.includes('consult your doctor') ||

    text.includes('medical disclaimer') ||

    text.includes('not medical advice');

  const medicalDisclaimerScore =

    hasMedicalDisclaimer
      ? 1
      : 0;

  // ========================================
  // SOURCE-SPECIFIC WEIGHTS
  // ========================================

  let weights = {

    author_credibility: 0.25,
    citation_count: 0.20,
    domain_authority: 0.25,
    recency: 0.20,
    medical_disclaimer_presence: 0.10
  };

  // ========================================
  // YOUTUBE WEIGHTS
  // ========================================

  if (
    data.source_type === 'youtube'
  ) {

    weights = {

      author_credibility: 0.4,
      citation_count: 0.0,
      domain_authority: 0.3,
      recency: 0.3,
      medical_disclaimer_presence: 0.0
    };
  }

  // ========================================
  // BLOG WEIGHTS
  // ========================================

  if (
    data.source_type === 'blog'
  ) {

    weights = {

      author_credibility: 0.3,
      citation_count: 0.1,
      domain_authority: 0.3,
      recency: 0.2,
      medical_disclaimer_presence: 0.1
    };
  }

  // ========================================
  // FINAL TRUST SCORE
  // ========================================

  const trustScore =

    (
      authorCredibility *
      weights.author_credibility
    ) +

    (
      citationScore *
      weights.citation_count
    ) +

    (
      domainAuthority *
      weights.domain_authority
    ) +

    (
      recencyScore *
      weights.recency
    ) +

    (
      medicalDisclaimerScore *
      weights.medical_disclaimer_presence
    );

  return {

    trust_score:

      Number(
        trustScore.toFixed(2)
      ),

    trust_breakdown: {

      author_credibility:
        Number(authorCredibility.toFixed(2)),

      citation_count:
        Number(citationScore.toFixed(2)),

      domain_authority:
        Number(domainAuthority.toFixed(2)),

      recency:
        Number(recencyScore.toFixed(2)),

      medical_disclaimer_presence:
        Number(
          medicalDisclaimerScore.toFixed(2)
        )
    }
  };
};