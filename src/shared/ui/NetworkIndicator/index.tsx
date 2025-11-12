import React from 'react';
import { useNetworkStatus } from '@/shared/lib';

import { OfflineIcon } from '@/shared/assets/icons/OfflineIcon';
import { OnlineIcon } from '@/shared/assets/icons/OnlineIcon';

import styles from './styles.module.scss';

export const NetworkIndicator: React.FC = () => {
  const online = useNetworkStatus();

  return (
    <div
      className={[styles.networkStatus, online ? styles.online : styles.offline].join(' ')}
      role="status"
      aria-live="polite"
    >
      {online ? (
        <>
          <OnlineIcon aria-hidden />
          <span>Online</span>
        </>
      ) : (
        <>
          <OfflineIcon aria-hidden />
          <span>Offline</span>
        </>
      )}
    </div>
  );
};
