import { SentimentResponse } from '@/types';

/**
 * Validates the text input for sentiment analysis
 * @param text The text to validate
 * @returns An object with validation result and error message if any
 */
export function validateText(text: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  // Check if text is empty
  if (!text || text.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Text cannot be empty',
    };
  }

  // Check if text exceeds maximum length (500 characters)
  if (text.length > 500) {
    return {
      isValid: false,
      errorMessage: `Text is too long (${text.length}/500 characters)`,
    };
  }

  // Text is valid
  return { isValid: true };
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
  // Check if API key is empty
  if (!apiKey || apiKey.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'API key cannot be empty',
    };
  }

  // API key is valid
  return { isValid: true };
}

/**
 * Validates the sentiment analysis response
 * @param response The response object to validate
 * @returns A validated SentimentResponse object or throws an error
 */
export function validateSentimentResponse(response: unknown): SentimentResponse {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }

  const typedResponse = response as Record<string, unknown>;

  // Check if label exists and is one of the expected values
  if (!typedResponse.label || typeof typedResponse.label !== 'string') {
    throw new Error('Missing or invalid sentiment label');
  }

  const label = typedResponse.label.toUpperCase();
  if (label !== 'POSITIVE' && label !== 'NEGATIVE' && label !== 'NEUTRAL') {
    throw new Error(`Unsupported sentiment label: ${label}`);
  }

  // Check if score exists and is a number
  if (typedResponse.score === undefined || typeof typedResponse.score !== 'number') {
    throw new Error('Missing or invalid sentiment score');
  }

  // Return a properly typed response
  return {
    label: label as SentimentResponse['label'],
    score: typedResponse.score,
  };
}
