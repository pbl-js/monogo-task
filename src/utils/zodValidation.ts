import { z } from 'zod';
import { SentimentResponse } from '@/types';
import { AxiosResponse } from 'axios';

export const textSchema = z
  .string()
  .min(1, { message: 'Text cannot be empty' })
  .max(500, { message: 'Text is too long (max 500 characters)' });

export const apiKeySchema = z.string().min(1, { message: 'API key cannot be empty' });

export const sentimentResponseSchema = z.object({
  label: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
  score: z.number(),
});

const labelScoreSchema = z.object({
  label: z.union([z.literal('POSITIVE'), z.literal('NEGATIVE'), z.literal('NEUTRAL')]),
  score: z.number(),
});

// Schema for the specific API response format: [[{ label, score }, { label, score }]]
export const apiResponseSchema = z.array(z.array(labelScoreSchema));

/**
 * Validates and normalizes the API response
 * @param response The raw Axios API response
 * @returns A validated SentimentResponse object
 */
export function parseApiResponse(response: AxiosResponse): SentimentResponse {
  if (!response.data) {
    throw new Error('Empty API response');
  }

  try {
    const parsedData = apiResponseSchema.parse(response.data);

    // Get the first result (highest confidence)
    const firstResult = parsedData[0][0];

    return {
      label: firstResult.label,
      score: firstResult.score,
    };
  } catch (error) {
    console.error('Error parsing API response:', error);
    throw new Error('Could not parse sentiment data from API response');
  }
}

/**
 * Validates text input for sentiment analysis
 * @param text The text to validate
 * @returns An object with validation result and error message if any
 */
export function validateText(text: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  try {
    textSchema.parse(text);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errorMessage: error.errors[0]?.message || 'Invalid text',
      };
    }
    return {
      isValid: false,
      errorMessage: 'Invalid text',
    };
  }
}

/**
 * Validates the API key
 * @param apiKey The API key to validate
 * @returns An object with validation result and error message if any
 */
export function validateApiKey(apiKey: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  try {
    apiKeySchema.parse(apiKey);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errorMessage: error.errors[0]?.message || 'Invalid API key',
      };
    }
    return {
      isValid: false,
      errorMessage: 'Invalid API key',
    };
  }
}
