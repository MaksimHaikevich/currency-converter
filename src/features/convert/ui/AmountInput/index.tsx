import React, { type ChangeEvent, useCallback, useRef } from 'react';

import { useConverterDispatch, useConverterState } from '@/features/convert/model';
import { sanitizeAmountInput } from '@/shared/lib';

import styles from './styles.module.scss';

export type AmountInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
>;

export const AmountInput: React.FC<AmountInputProps> = ({ className, ...rest }) => {
  const { amount } = useConverterState();
  const dispatch = useConverterDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const setAmount = useCallback(
    (value: string) => dispatch({ type: 'setAmount', value }),
    [dispatch],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeAmountInput(e.target.value);
      setAmount(sanitized);
    },
    [setAmount],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData('text');
      const cleaned = sanitizeAmountInput(text);
      const input = inputRef.current;
      if (!input) return;

      e.preventDefault();

      const start = input.selectionStart ?? amount.length;
      const end = input.selectionEnd ?? amount.length;

      const next = sanitizeAmountInput(amount.slice(0, start) + cleaned + amount.slice(end));

      setAmount(next);

      requestAnimationFrame(() => {
        const pos = start + cleaned.length;
        input.setSelectionRange(pos, pos);
      });
    },
    [amount, setAmount],
  );

  return (
    <div className={styles.container}>
      <span className={styles.label}>Amount</span>
      <input
        ref={inputRef}
        className={className ?? styles.amountInput}
        value={amount}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="Enter amount"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        pattern="[0-9]*[.,]?[0-9]*"
        aria-label="Amount"
        {...rest}
      />
    </div>
  );
};
