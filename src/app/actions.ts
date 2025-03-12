'use server';

import axios from 'axios';
import { SentimentResponse } from '@/types';
import { validateText, validateSentimentResponse } from '@/utils/validation';

// Hugging Face API endpoint for sentiment analysis
const API_URL =
  'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';

/**
 * Server action to analyze sentiment using the Hugging Face API
 * The API key is retrieved from environment variables
 */
export async function analyzeSentimentAction(text: string): Promise<{
  success: boolean;
  result?: SentimentResponse;
  error?: string;
}> {
  // Validate the text input
  const textValidation = validateText(text);
  if (!textValidation.isValid) {
    return {
      success: false,
      error: textValidation.errorMessage || 'Invalid text',
    };
  }

  // Get API key from environment variable
  const apiKey = process.env.HUGGING_FACE_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'API key is not configured on the server',
    };
  }

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

    if (!response.data) {
      throw new Error('Empty API response');
    }

    let result;
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        throw new Error('Empty result array from API');
      }
      result = response.data[0];
    } else {
      result = response.data;
    }

    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result format from API');
    }

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

    // Use validateSentimentResponse for final validation
    const validatedResult = validateSentimentResponse({
      label: normalizedLabel,
      score: score,
    });

    return {
      success: true,
      result: validatedResult,
    };
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: `API Error: ${error.response?.data?.error || error.message}`,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
