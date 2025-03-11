import { describe, it, expect } from 'vitest';
import { validateText, validateApiKey } from '../validation';

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
