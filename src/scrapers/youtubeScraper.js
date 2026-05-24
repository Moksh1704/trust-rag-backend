import { YoutubeTranscript } from 'youtube-transcript';

export async function scrapeYouTube(url) {

  try {

    let videoId = '';

    // Handle youtube.com URLs
    if (url.includes('youtube.com')) {
      videoId = new URL(url).searchParams.get('v');
    }

    // Handle youtu.be URLs
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop();
    }

    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const transcript =
      await YoutubeTranscript.fetchTranscript(videoId);

    const fullText = transcript
      .map(item => item.text)
      .join(' ');

    return {
      source_url: url,
      source_type: 'youtube',
      title: `YouTube Video ${videoId}`,
      author: 'Unknown Channel',
      published_date: null,
      text: fullText
    };

  } catch (error) {

    throw new Error(
      `YouTube scraping failed: ${error.message}`
    );
  }
}