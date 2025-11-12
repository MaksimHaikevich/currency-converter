import React from 'react';

import { Skeleton } from '@/shared/ui';
import { formatNumber } from '@/shared/lib';

import styles from './styles.module.scss';

interface ResultCardProps {
  loading: boolean;
  error?: string;
  converted: number | null;
  numAmount: number;
  from: string;
  to: string;
  rate: number | null;
  inverseRate: number | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  loading,
  error,
  converted,
  numAmount,
  from,
  to,
  rate,
  inverseRate,
}) => {
  const renderConverted = () => {
    if (loading) return <Skeleton width={90} height={24} />;
    if (error) return <>—</>;
    if (converted !== null) return <>{formatNumber(converted, to)}</>;
    return <>—</>;
  };

  const renderAmountHint = () => {
    if (Number.isFinite(numAmount)) return <span>{formatNumber(numAmount, from)}</span>;
    return <span>Enter amount</span>;
  };

  const RateRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className={styles.rateRow}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {loading ? <Skeleton width={130} height={12} radius={6} /> : (value ?? '—')}
      </div>
    </div>
  );

  return (
    <aside className={styles.conversionContainer}>
      <div className={styles.title}>Conversion result</div>

      <div className={styles.resultValueContainer}>
        <div className={styles.converted}>{renderConverted()}</div>
        <div className={styles.amountHint}>{renderAmountHint()} =</div>
      </div>

      <div className={styles.devider} />
      <div className={styles.conversionInfo}>
        <RateRow
          label="Exchange Rate"
          value={rate ? `1 ${from} = ${rate.toFixed(6)} ${to}` : null}
        />
        <RateRow
          label="Inverse Rate"
          value={inverseRate ? `1 ${to} = ${inverseRate.toFixed(6)} ${from}` : null}
        />
      </div>

      <div className={styles.devider} />

      <div className={styles.description}>
        Rates are for informational purposes only and may not reflect real-time market rates
      </div>
    </aside>
  );
};
