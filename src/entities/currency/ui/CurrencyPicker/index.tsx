import React, { useMemo, useState } from 'react';
import { Dialog } from './Dialog';
import { Trigger } from './Trigger';
import { findCurrency } from './helpers';
import type { CurrencyOption } from './types';

import styles from './styles.module.scss';

type Props = {
  value: string;
  onChange: (code: string) => void;
  label: string;
  className?: string;
};

export const CurrencyPicker: React.FC<Props> = ({ value, onChange, label, className }) => {
  const [open, setOpen] = useState(false);
  const current: CurrencyOption | undefined = useMemo(() => findCurrency(value), [value]);

  return (
    <div className={[styles.field, className ?? ''].join(' ')}>
      <div className={styles.label}>{label}</div>

      <Trigger currency={current} fallbackCode={value} onClick={() => setOpen(true)} />

      {open && (
        <Dialog
          value={value}
          onSelect={(code) => {
            onChange(code);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};
