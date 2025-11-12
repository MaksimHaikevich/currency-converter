import React from 'react';

import { AmountInput, SwapButton } from '@/features/convert/ui';
import { CurrencyPicker } from '@/entities/currency/ui';

import styles from './styles.module.scss';

interface ConverterFormProps {
  from: string;
  to: string;
  onChangeFrom: (code: string) => void;
  onChangeTo: (code: string) => void;
}

export const ConverterForm: React.FC<ConverterFormProps> = ({
  from,
  to,
  onChangeFrom,
  onChangeTo,
}) => {
  return (
    <section className={styles.converterForm}>
      <AmountInput />
      <div className={styles.currenciesContainer}>
        <CurrencyPicker label="From" value={from} onChange={onChangeFrom} />
        <SwapButton />
        <CurrencyPicker label="To" value={to} onChange={onChangeTo} />
      </div>
    </section>
  );
};
