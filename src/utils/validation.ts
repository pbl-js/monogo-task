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
  if (!text || text.trim() === "") {
    return {
      isValid: false,
      errorMessage: "Text cannot be empty",
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
  if (!apiKey || apiKey.trim() === "") {
    return {
      isValid: false,
      errorMessage: "API key cannot be empty",
    };
  }

  // API key is valid
  return { isValid: true };
}
