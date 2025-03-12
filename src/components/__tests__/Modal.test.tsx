import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';
import { SentimentResponse } from '@/types';

vi.mock('@/consts/sentimentInfo', () => ({
  sentimentInfo: {
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
  },
}));

// Mock the styles to fix the className tests
vi.mock('../Modal.module.scss', () => ({
  default: {
    iconPositive: 'iconPositive',
    iconNegative: 'iconNegative',
    iconNeutral: 'iconNeutral',
  },
}));

describe('Modal Component', () => {
  const mockOnClose = vi.fn();

  const positiveResult: SentimentResponse = {
    label: 'POSITIVE',
    score: 0.95,
  };

  const negativeResult: SentimentResponse = {
    label: 'NEGATIVE',
    score: 0.85,
  };

  const neutralResult: SentimentResponse = {
    label: 'NEUTRAL',
    score: 0.6,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    // Add event listener mock for document
    vi.spyOn(document, 'addEventListener');
    vi.spyOn(document, 'removeEventListener');
  });

  it('renders nothing when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={mockOnClose} result={positiveResult} />);
    expect(screen.queryByText('positive')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={positiveResult} />);
    expect(screen.getByText('positive')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 95%')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The text expresses a positive sentiment, showing approval, happiness, or optimism.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To maintain this positive tone, continue using affirmative language and focus on benefits and solutions.'
      )
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={positiveResult} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays correct icon for positive sentiment', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={positiveResult} />);

    const iconContainer = screen.getByTestId('sentiment-icon');
    expect(iconContainer).toHaveClass('iconPositive');
  });

  it('displays correct icon for negative sentiment', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={negativeResult} />);

    const iconContainer = screen.getByTestId('sentiment-icon');
    expect(iconContainer).toHaveClass('iconNegative');
  });

  it('displays correct icon for neutral sentiment', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={neutralResult} />);

    const iconContainer = screen.getByTestId('sentiment-icon');
    expect(iconContainer).toHaveClass('iconNeutral');
  });

  it('adds event listeners when modal is open', () => {
    render(<Modal isOpen={true} onClose={mockOnClose} result={positiveResult} />);

    expect(document.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('removes event listeners when modal is closed', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose} result={positiveResult} />
    );
    unmount();

    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
