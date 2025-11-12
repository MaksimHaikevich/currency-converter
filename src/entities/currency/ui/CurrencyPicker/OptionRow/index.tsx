import React from 'react';
import type { CurrencyOption } from '../types';
import { CheckIcon } from '@/shared/assets/icons/CheckIcon.tsx';

import styles from './styles.module.scss';

type Props = {
  item: CurrencyOption;
  index: number;
  selected: boolean;
  active: boolean;
  onHover: (index: number) => void;
  onSelect: (code: string) => void;
};

export const OptionRow: React.FC<Props> = ({
  item,
  index,
  selected,
  active,
  onHover,
  onSelect,
}) => {
  const className = [styles.row, active ? styles.active : '', selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      id={`currency-opt-${index}`}
      data-idx={index}
      role="option"
      aria-selected={selected}
      className={className}
      onMouseEnter={() => onHover(index)}
      onClick={() => onSelect(item.code)}
    >
      <div className={styles.symbol} aria-hidden>
        {item.symbol ?? '-'}
      </div>
      <div className={styles.texts}>
        <div className={styles.code}>{item.code}</div>
        <div className={styles.name}>{item.name}</div>
      </div>
      {selected && (
        <div className={styles.check}>
          <CheckIcon />
        </div>
      )}
    </button>
  );
};
