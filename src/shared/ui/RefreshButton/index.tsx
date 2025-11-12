import React from 'react';

import { ReloadIcon } from '@/shared/assets/icons/ReloadIcon.tsx';

import styles from './styles.module.scss';

type Props = { onClick: () => void | Promise<void>; loading?: boolean };

export const RefreshButton: React.FC<Props> = ({ onClick, loading }) => (
  <button type="button" onClick={onClick} className={styles.refreshBtn} disabled={loading}>
    <ReloadIcon /> Refresh rates
  </button>
);
