'use client';

import React, { useState } from 'react';
import { FaSearch, FaInfoCircle } from 'react-icons/fa';
import TextInput from './TextInput';
import Button from './Button';
import Modal from './Modal';
import { analyzeSentiment } from '@/services/sentimentService';
import { validateText, validateApiKey, validateSentimentResponse } from '@/utils/validation';
import { SentimentAnalysisState } from '@/types';
import styles from './SentimentAnalyzer.module.scss';

export default function SentimentAnalyzer() {
  // State for form inputs
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');

  // State for validation errors
  const [textError, setTextError] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');

  // State for sentiment analysis
  const [analysisState, setAnalysisState] = useState<SentimentAnalysisState>({
    status: 'idle',
  });

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle text change
  const handleTextChange = (value: string) => {
    setText(value);

    // Clear error when user starts typing
    if (textError) {
      setTextError('');
    }
  };

  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);

    // Clear error when user starts typing
    if (apiKeyError) {
      setApiKeyError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const textValidation = validateText(text);
    const apiKeyValidation = validateApiKey(apiKey);

    // Set validation errors if any
    if (!textValidation.isValid) {
      setTextError(textValidation.errorMessage || 'Invalid text');
    }

    if (!apiKeyValidation.isValid) {
      setApiKeyError(apiKeyValidation.errorMessage || 'Invalid API key');
    }

    // Return if validation fails
    if (!textValidation.isValid || !apiKeyValidation.isValid) {
      return;
    }

    // Set loading state
    setAnalysisState({
      status: 'loading',
    });

    try {
      // Call API to analyze sentiment
      const apiResponse = await analyzeSentiment(text, apiKey);

      // Validate the response using our new validation function
      const validatedResult = validateSentimentResponse(apiResponse);

      // Set success state with validated result
      setAnalysisState({
        status: 'success',
        result: validatedResult,
      });

      // Open modal to display result
      setIsModalOpen(true);
    } catch (error) {
      console.error('Sentiment analysis error:', error);

      // Set error state
      setAnalysisState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.analyzer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sentiment Analyzer</h1>
        <p className={styles.description}>
          Enter your text below to analyze its sentiment. Our AI will determine if the text
          expresses a positive, negative, or neutral sentiment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="text" className={styles.label}>
            Text to Analyze
          </label>
          <TextInput
            value={text}
            onChange={handleTextChange}
            maxLength={500}
            placeholder="Enter text to analyze (max 500 characters)..."
            error={textError}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="apiKey" className={styles.label}>
            Hugging Face API Key
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.apiKeyHelp}
            >
              <FaInfoCircle /> Get API Key
            </a>
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your Hugging Face API key..."
            className={`${styles.apiKeyInput} ${apiKeyError ? styles.hasError : ''}`}
          />
          {apiKeyError && <div className={styles.errorMessage}>{apiKeyError}</div>}
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            isLoading={analysisState.status === 'loading'}
            disabled={analysisState.status === 'loading'}
            fullWidth
          >
            <FaSearch className={styles.buttonIcon} />
            Analyze Sentiment
          </Button>
        </div>

        {analysisState.status === 'error' && (
          <div className={styles.errorAlert}>
            <p>{analysisState.error}</p>
          </div>
        )}
      </form>

      {analysisState.status === 'success' && analysisState.result && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} result={analysisState.result} />
      )}
    </div>
  );
}
