import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SentimentAnalyzer from '../SentimentAnalyzer';
import { SentimentResponse } from '@/types';

vi.mock('@/app/actions', () => ({
  analyzeSentimentAction: vi.fn(),
}));

vi.mock('@/utils/validation', () => ({
  validateText: vi.fn(text => {
    if (!text || text.trim() === '') {
      return {
        isValid: false,
        errorMessage: 'Text cannot be empty',
      };
    }
    if (text.length > 500) {
      return {
        isValid: false,
        errorMessage: `Text is too long (${text.length}/500 characters)`,
      };
    }
    return { isValid: true };
  }),
}));

import { analyzeSentimentAction } from '@/app/actions';

describe('SentimentAnalyzer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<SentimentAnalyzer />);

    expect(screen.getByText('Sentiment Analyzer')).toBeInTheDocument();
    expect(screen.getByText(/Enter your text below/)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze Sentiment/i })).toBeInTheDocument();
  });

  it('updates text input when user types', () => {
    render(<SentimentAnalyzer />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(input).toHaveValue('Hello world');
  });

  it('shows error when submitting empty text', async () => {
    render(<SentimentAnalyzer />);

    const submitButton = screen.getByRole('button', { name: /Analyze Sentiment/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Text cannot be empty')).toBeInTheDocument();
    expect(analyzeSentimentAction).not.toHaveBeenCalled();
  });

  it('calls analyzeSentimentAction when submitting valid text', async () => {
    const mockResult: SentimentResponse = {
      label: 'POSITIVE',
      score: 0.95,
    };

    (analyzeSentimentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      result: mockResult,
    });

    render(<SentimentAnalyzer />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'This is a great day!' } });

    const submitButton = screen.getByRole('button', { name: /Analyze Sentiment/i });
    fireEvent.click(submitButton);

    expect(analyzeSentimentAction).toHaveBeenCalledWith('This is a great day!');

    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows modal with results when analysis is successful', async () => {
    const mockResult: SentimentResponse = {
      label: 'POSITIVE',
      score: 0.95,
    };

    (analyzeSentimentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      result: mockResult,
    });

    render(<SentimentAnalyzer />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'This is a great day!' } });

    const submitButton = screen.getByRole('button', { name: /Analyze Sentiment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('positive')).toBeInTheDocument();
    });
  });

  it('shows error message when analysis fails', async () => {
    (analyzeSentimentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: 'API Error: Failed to analyze sentiment',
    });

    render(<SentimentAnalyzer />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'This is a great day!' } });

    const submitButton = screen.getByRole('button', { name: /Analyze Sentiment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('API Error: Failed to analyze sentiment')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    const mockResult: SentimentResponse = {
      label: 'POSITIVE',
      score: 0.95,
    };

    (analyzeSentimentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      result: mockResult,
    });

    render(<SentimentAnalyzer />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'This is a great day!' } });

    const submitButton = screen.getByRole('button', { name: /Analyze Sentiment/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('positive')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('positive')).not.toBeInTheDocument();
  });
});
