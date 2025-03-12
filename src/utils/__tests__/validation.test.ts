import { describe, it, expect } from 'vitest';
import { validateText, validateApiKey, validateSentimentResponse } from '../validation';

describe('validateText', () => {
  it('should return isValid: true for valid text', () => {
    const result = validateText('This is a valid text');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should return isValid: false for empty text', () => {
    const result = validateText('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Text cannot be empty');
  });

  it('should return isValid: false for whitespace-only text', () => {
    const result = validateText('   ');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('Text cannot be empty');
  });

  it('should return isValid: false for text exceeding 500 characters', () => {
    // Create a string with 501 characters
    const longText = 'a'.repeat(501);
    const result = validateText(longText);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(`Text is too long (501/500 characters)`);
  });

  it('should return isValid: true for text with exactly 500 characters', () => {
    // Create a string with 500 characters
    const maxLengthText = 'a'.repeat(500);
    const result = validateText(maxLengthText);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});

describe('validateApiKey', () => {
  it('should return isValid: true for valid API key', () => {
    const result = validateApiKey('valid-api-key-123');
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should return isValid: false for empty API key', () => {
    const result = validateApiKey('');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('API key cannot be empty');
  });

  it('should return isValid: false for whitespace-only API key', () => {
    const result = validateApiKey('   ');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('API key cannot be empty');
  });
});

describe('validateSentimentResponse', () => {
  it('should validate a correct positive response', () => {
    const response = {
      label: 'POSITIVE',
      score: 0.95,
    };

    const result = validateSentimentResponse(response);
    expect(result).toEqual({
      label: 'POSITIVE',
      score: 0.95,
    });
  });

  it('should validate a correct negative response', () => {
    const response = {
      label: 'NEGATIVE',
      score: 0.85,
    };

    const result = validateSentimentResponse(response);
    expect(result).toEqual({
      label: 'NEGATIVE',
      score: 0.85,
    });
  });

  it('should validate a correct neutral response', () => {
    const response = {
      label: 'NEUTRAL',
      score: 0.6,
    };

    const result = validateSentimentResponse(response);
    expect(result).toEqual({
      label: 'NEUTRAL',
      score: 0.6,
    });
  });

  it('should normalize lowercase label to uppercase', () => {
    const response = {
      label: 'positive',
      score: 0.95,
    };

    const result = validateSentimentResponse(response);
    expect(result).toEqual({
      label: 'POSITIVE',
      score: 0.95,
    });
  });

  it('should throw error for non-object response', () => {
    expect(() => validateSentimentResponse('not an object')).toThrow('Invalid response format');
    expect(() => validateSentimentResponse(null)).toThrow('Invalid response format');
    expect(() => validateSentimentResponse(undefined)).toThrow('Invalid response format');
  });

  it('should throw error for missing label', () => {
    const response = {
      score: 0.95,
    };

    expect(() => validateSentimentResponse(response)).toThrow('Missing or invalid sentiment label');
  });

  it('should throw error for invalid label type', () => {
    const response = {
      label: 123,
      score: 0.95,
    };

    expect(() => validateSentimentResponse(response)).toThrow('Missing or invalid sentiment label');
  });

  it('should throw error for unsupported label value', () => {
    const response = {
      label: 'UNKNOWN',
      score: 0.95,
    };

    expect(() => validateSentimentResponse(response)).toThrow(
      'Unsupported sentiment label: UNKNOWN'
    );
  });

  it('should throw error for missing score', () => {
    const response = {
      label: 'POSITIVE',
    };

    expect(() => validateSentimentResponse(response)).toThrow('Missing or invalid sentiment score');
  });

  it('should throw error for invalid score type', () => {
    const response = {
      label: 'POSITIVE',
      score: 'not a number',
    };

    expect(() => validateSentimentResponse(response)).toThrow('Missing or invalid sentiment score');
  });
});
