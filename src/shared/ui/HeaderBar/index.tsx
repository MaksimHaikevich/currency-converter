import React from 'react';
import { NetworkIndicator, RefreshButton } from '@/shared/ui';
import { ClockIcon } from '@/shared/assets/icons/ClockIcon.tsx';
import { useNetworkStatus } from '@/shared/lib';
import styles from './styles.module.scss';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  lastUpdatedTs?: number;
  onRefresh: () => void;
  loading?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'Currency converter',
  subtitle = 'Get real-time exchange rates',
  lastUpdatedTs,
  onRefresh,
  loading,
}) => {
  const online = useNetworkStatus();
  const hasTs = typeof lastUpdatedTs === 'number';
  const ts = hasTs ? new Date(lastUpdatedTs!).toLocaleString() : '';

  const updateText = !online
    ? hasTs
      ? `Using cached rates from ${ts}`
      : 'Using cached rates'
    : hasTs
      ? `Last updated: ${ts}`
      : '';

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.statuses}>
        <NetworkIndicator />
        {updateText && (
          <span className={styles.updateStatus}>
            <ClockIcon />
            {updateText}
          </span>
        )}
        <RefreshButton onClick={onRefresh} loading={loading} />
      </div>
    </div>
  );
};
