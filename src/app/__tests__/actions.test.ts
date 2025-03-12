import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { analyzeSentimentAction } from '../actions';
import { validateText, parseApiResponse } from '@/utils/zodValidation';

vi.mock('axios');
vi.mock('@/utils/zodValidation', () => ({
  validateText: vi.fn(),
  parseApiResponse: vi.fn(),
}));

// Mock environment variables
vi.stubEnv('HUGGING_FACE_API_KEY', 'test-api-key');

describe('App Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeSentimentAction', () => {
    it('should return error when text validation fails', async () => {
      (validateText as ReturnType<typeof vi.fn>).mockReturnValue({
        isValid: false,
        errorMessage: 'Text cannot be empty',
      });

      const result = await analyzeSentimentAction('');

      expect(result).toEqual({
        success: false,
        error: 'Text cannot be empty',
      });
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should return error when API key is not configured', async () => {
      (validateText as ReturnType<typeof vi.fn>).mockReturnValue({
        isValid: true,
      });

      // Temporarily remove the API key from environment
      const originalApiKey = process.env.HUGGING_FACE_API_KEY;
      delete process.env.HUGGING_FACE_API_KEY;

      const result = await analyzeSentimentAction('This is a test text');

      expect(result).toEqual({
        success: false,
        error: 'API key is not configured on the server',
      });
      expect(axios.post).not.toHaveBeenCalled();

      // Restore the API key
      process.env.HUGGING_FACE_API_KEY = originalApiKey;
    });

    it('should call API and return success response', async () => {
      (validateText as ReturnType<typeof vi.fn>).mockReturnValue({
        isValid: true,
      });

      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {
          label: 'POSITIVE',
          score: 0.95,
        },
      });

      const mockResult = {
        label: 'POSITIVE' as const,
        score: 0.95,
      };
      (parseApiResponse as ReturnType<typeof vi.fn>).mockReturnValue(mockResult);

      const result = await analyzeSentimentAction('This is a test text');

      expect(result).toEqual({
        success: true,
        result: mockResult,
      });

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), // API URL
        { inputs: 'This is a test text' },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(parseApiResponse).toHaveBeenCalledWith({
        data: {
          label: 'POSITIVE',
          score: 0.95,
        },
      });
    });

    it('should handle parseApiResponse errors', async () => {
      // Mock validateText to return success
      (validateText as ReturnType<typeof vi.fn>).mockReturnValue({
        isValid: true,
      });

      // Mock axios.post to return a successful response
      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: {
          label: 'UNKNOWN',
          score: 0.95,
        },
      });

      // Mock parseApiResponse to throw an error
      const errorMessage = 'Invalid sentiment label: UNKNOWN';
      (parseApiResponse as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = await analyzeSentimentAction('This is a test text');

      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });
  });
});
