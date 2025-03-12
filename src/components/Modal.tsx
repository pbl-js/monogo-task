'use client';

import React, { useEffect, useRef } from 'react';
import { FaTimes, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { SentimentResponse } from '@/types';
import { sentimentInfo } from '@/consts/sentimentInfo';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SentimentResponse;
}

export default function Modal({ isOpen, onClose, result }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSentimentIcon = () => {
    const iconMap = {
      POSITIVE: <FaSmile className={styles.iconPositive} data-testid="sentiment-icon" />,
      NEGATIVE: <FaFrown className={styles.iconNegative} data-testid="sentiment-icon" />,
      NEUTRAL: <FaMeh className={styles.iconNeutral} data-testid="sentiment-icon" />,
    };

    return iconMap[result.label];
  };

  const info = sentimentInfo[result.label];

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className={styles.sentimentResult}>
          <div className={styles.iconContainer}>{getSentimentIcon()}</div>
          <h2 className={styles.sentimentLabel}>{result.label.toLowerCase()}</h2>
          <div className={styles.sentimentScore}>Confidence: {Math.round(result.score * 100)}%</div>
        </div>

        <div className={styles.sentimentInfo}>
          <h3>What does this mean?</h3>
          <p>{info.description}</p>

          <h3>Pro Tip</h3>
          <p>{info.tip}</p>
        </div>
      </div>
    </div>
  );
}
