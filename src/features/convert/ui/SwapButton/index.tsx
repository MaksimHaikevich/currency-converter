import React from 'react';

import { useConverterDispatch } from '@/features/convert/model';
import { SwapIcon } from '@/shared/assets/icons/SwapIcon.tsx';

import styles from './styles.module.scss';

export interface SwapButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onSwap?: () => void;
}

export function SwapButton({ onSwap, disabled, title, ...rest }: SwapButtonProps) {
  const dispatch = useConverterDispatch();

  const handleClick = () => {
    dispatch({ type: 'swap' });
    onSwap?.();
  };

  return (
    <button
      type="button"
      aria-label="Swap currencies"
      title={title ?? 'Swap currencies'}
      data-testid="swap-button"
      className={styles.swapButton}
      disabled={disabled}
      onClick={handleClick}
      style={{ padding: 8 }}
      {...rest}
    >
      <span aria-hidden>
        <SwapIcon />
      </span>
    </button>
  );
}
