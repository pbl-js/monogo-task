'use client';

import React, { useEffect, useRef } from 'react';
import { FaTimes, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { SentimentResponse } from '@/types';
import { sentimentInfo } from '@/services/sentimentService';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SentimentResponse;
}

export default function Modal({ isOpen, onClose, result }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
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

  // Close modal when pressing Escape key
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

  // Get sentiment icon based on the result
  const getSentimentIcon = () => {
    switch (result?.label) {
      case 'POSITIVE':
        return <FaSmile className={styles.iconPositive} />;
      case 'NEGATIVE':
        return <FaFrown className={styles.iconNegative} />;
      case 'NEUTRAL':
        return <FaMeh className={styles.iconNeutral} />;
      default:
        return null;
    }
  };

  // Get sentiment info
  const info = result?.label ? sentimentInfo[result.label] : null;

  return (
    <div className={styles.modalOverlay}>
      <div ref={modalRef} className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className={styles.sentimentResult}>
          <div className={styles.iconContainer}>{getSentimentIcon()}</div>
          <h2 className={styles.sentimentLabel}>
            {result?.label ? result.label.toLowerCase() : 'unknown'}
          </h2>
          <div className={styles.sentimentScore}>
            Confidence: {result?.score ? Math.round(result.score * 100) : 0}%
          </div>
        </div>

        <div className={styles.sentimentInfo}>
          <h3>What does this mean?</h3>
          <p>{info?.description || 'No information available'}</p>

          <h3>Pro Tip</h3>
          <p>{info?.tip || 'No tip available'}</p>
        </div>
      </div>
    </div>
  );
}
