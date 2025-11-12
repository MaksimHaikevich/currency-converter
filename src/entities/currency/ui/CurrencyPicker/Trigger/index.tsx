import React from 'react';
import type { CurrencyOption } from '../types.ts';

import styles from './styles.module.scss';

type Props = {
  currency?: CurrencyOption;
  fallbackCode: string;
  onClick: () => void;
};

export const Trigger: React.FC<Props> = ({ currency, fallbackCode, onClick }) => {
  return (
    <button
      className={styles.currencySelect}
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
    >
      <div className={styles.symbol} aria-hidden>
        {currency?.symbol ?? '-'}
      </div>
      <div className={styles.currencyInfo} aria-hidden>
        <div className={styles.code}>{currency?.code ?? fallbackCode}</div>
        <div className={styles.name}>{currency?.name ?? 'Select'}</div>
      </div>
    </button>
  );
};
