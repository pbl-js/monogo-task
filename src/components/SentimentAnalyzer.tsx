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
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');

  const [textError, setTextError] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');

  const [analysisState, setAnalysisState] = useState<SentimentAnalysisState>({
    status: 'idle',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTextChange = (value: string) => {
    setText(value);

    if (textError) {
      setTextError('');
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);

    if (apiKeyError) {
      setApiKeyError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const textValidation = validateText(text);
    const apiKeyValidation = validateApiKey(apiKey);

    if (!textValidation.isValid) {
      setTextError(textValidation.errorMessage || 'Invalid text');
    }

    if (!apiKeyValidation.isValid) {
      setApiKeyError(apiKeyValidation.errorMessage || 'Invalid API key');
    }

    if (!textValidation.isValid || !apiKeyValidation.isValid) {
      return;
    }

    setAnalysisState({
      status: 'loading',
    });

    try {
      const apiResponse = await analyzeSentiment(text, apiKey);

      const validatedResult = validateSentimentResponse(apiResponse);

      setAnalysisState({
        status: 'success',
        result: validatedResult,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error('Sentiment analysis error:', error);

      setAnalysisState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

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
