'use server';

import axios from 'axios';
import { SentimentResponse } from '@/types';
import { validateText, parseApiResponse } from '@/utils/zodValidation';

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
  const textValidation = validateText(text);
  if (!textValidation.isValid) {
    return {
      success: false,
      error: textValidation.errorMessage || 'Invalid text',
    };
  }

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

    const validatedResult = parseApiResponse(response);

    return {
      success: true,
      result: validatedResult,
    };
  } catch (error) {
    let errorMessage = 'Unknown error occurred';

    console.error('Error in analyzeSentimentAction:', error);

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      errorMessage = `API Error: ${error.response?.data?.error || error.message}`;

      if (error.response?.data) {
        console.error('API Error Response:', error.response.data);
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
