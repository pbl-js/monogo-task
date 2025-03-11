'use client';

import React, { useState, useEffect } from 'react';
import styles from './TextInput.module.scss';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  error?: string;
}

export default function TextInput({
  value,
  onChange,
  maxLength = 500,
  placeholder = 'Enter text to analyze...',
  error,
}: TextInputProps) {
  const [charCount, setCharCount] = useState(0);

  // Update character count when value changes
  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className={styles.textInputContainer}>
      <textarea
        className={`${styles.textInput} ${error ? styles.hasError : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={6}
        aria-label="Text to analyze"
        aria-invalid={!!error}
      />

      <div className={styles.inputFooter}>
        <div
          className={`${styles.charCount} ${charCount > maxLength * 0.9 ? styles.almostFull : ''}`}
        >
          {charCount}/{maxLength} characters
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  );
}
