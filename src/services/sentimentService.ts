import axios from 'axios';
import { SentimentResponse } from '@/types';

// Hugging Face API endpoint for sentiment analysis
const API_URL =
  'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';

/**
 * Analyzes the sentiment of the provided text using the Hugging Face API
 * @param text The text to analyze (max 500 characters)
 * @param apiKey The Hugging Face API key
 * @returns A promise that resolves to the sentiment analysis result
 */
export async function analyzeSentiment(text: string, apiKey: string): Promise<SentimentResponse> {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // eslint-disable-next-line no-console
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    // Validate the API response
    if (!response.data) {
      throw new Error('Empty API response');
    }

    // The API can return either an array or a single object
    let result;
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        throw new Error('Empty result array from API');
      }
      result = response.data[0];
    } else {
      result = response.data;
    }

    // Check if result has the required properties
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result format from API');
    }

    // Extract label and score with fallbacks
    const label = result.label || (result[0] && result[0].label);
    const score =
      typeof result.score === 'number'
        ? result.score
        : result[0] && typeof result[0].score === 'number'
          ? result[0].score
          : 0.5;

    if (!label) {
      throw new Error('No sentiment label found in API response');
    }

    // Normalize the label to one of our expected values
    let normalizedLabel: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

    if (typeof label === 'string') {
      const upperLabel = label.toUpperCase();
      if (upperLabel.includes('POSITIVE') || upperLabel === 'POSITIVE') {
        normalizedLabel = 'POSITIVE';
      } else if (upperLabel.includes('NEGATIVE') || upperLabel === 'NEGATIVE') {
        normalizedLabel = 'NEGATIVE';
      } else {
        normalizedLabel = 'NEUTRAL';
      }
    } else {
      normalizedLabel = 'NEUTRAL';
    }

    return {
      label: normalizedLabel,
      score: score,
    };
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
    }
    throw error;
  }
}

/**
 * Information about different sentiment types
 */
export const sentimentInfo = {
  POSITIVE: {
    description:
      'The text expresses a positive sentiment, showing approval, happiness, or optimism.',
    tip: 'To maintain this positive tone, continue using affirmative language and focus on benefits and solutions.',
  },
  NEGATIVE: {
    description:
      'The text expresses a negative sentiment, showing disapproval, sadness, or pessimism.',
    tip: 'To shift to a more positive tone, try focusing on solutions rather than problems, and use more constructive language.',
  },
  NEUTRAL: {
    description:
      'The text expresses a neutral sentiment, showing neither strong approval nor disapproval.',
    tip: 'To make your message more engaging, consider adding more descriptive or emotional language that aligns with your intent.',
  },
};
