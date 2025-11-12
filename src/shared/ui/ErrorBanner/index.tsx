import React from 'react';

interface ErrorBannerProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      style={{
        color: '#b91c1c',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
      }}
      role="alert"
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Couldn’t load rates.</div>
      <div style={{ marginBottom: 8 }}>{message}</div>
      <button
        type="button"
        onClick={onRetry}
        style={{
          padding: '6px 10px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          background: '#fff',
        }}
      >
        Try again
      </button>
    </div>
  );
};
