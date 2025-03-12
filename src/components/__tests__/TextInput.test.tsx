import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput Component', () => {
  it('renders with the provided value', () => {
    const value = 'Test input';
    render(<TextInput value={value} onChange={() => {}} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(value);
  });

  it('calls onChange handler when text is entered', () => {
    const handleChange = vi.fn();
    render(<TextInput value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('New text');
  });

  it('displays character count correctly', () => {
    const value = 'Hello world';
    render(<TextInput value={value} onChange={() => {}} />);

    expect(screen.getByText(`${value.length}/500 characters`)).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    const errorMessage = 'This is an error message';
    render(<TextInput value="" onChange={() => {}} error={errorMessage} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toContain('hasError');
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('uses default placeholder when none is provided', () => {
    render(<TextInput value="" onChange={() => {}} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text to analyze...');
  });

  it('uses custom placeholder when provided', () => {
    const customPlaceholder = 'Custom placeholder text';
    render(<TextInput value="" onChange={() => {}} placeholder={customPlaceholder} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', customPlaceholder);
  });

  it('respects maxLength prop', () => {
    const customMaxLength = 100;
    render(<TextInput value="" onChange={() => {}} maxLength={customMaxLength} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', String(customMaxLength));
    expect(screen.getByText(`0/${customMaxLength} characters`)).toBeInTheDocument();
  });

  it('applies almostFull class when character count exceeds 90% of maxLength', () => {
    const maxLength = 100;
    const value = 'a'.repeat(91); // 91% of maxLength

    render(<TextInput value={value} onChange={() => {}} maxLength={maxLength} />);

    const charCount = screen.getByText(`${value.length}/${maxLength} characters`);
    expect(charCount.className).toContain('almostFull');
  });

  it('does not apply almostFull class when character count is below 90% of maxLength', () => {
    const maxLength = 100;
    const value = 'a'.repeat(89); // 89% of maxLength

    render(<TextInput value={value} onChange={() => {}} maxLength={maxLength} />);

    const charCount = screen.getByText(`${value.length}/${maxLength} characters`);
    expect(charCount.className).not.toContain('almostFull');
  });
});
