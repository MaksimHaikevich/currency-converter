import { useEffect, useMemo, useState } from 'react';
import { useConverter } from '@/features/convert/model';
import {
  CACHE_TTL_MS,
  REFRESH_THROTTLE_MS,
  toNumberSafe,
  useDebouncedValue,
  useThrottle,
} from '@/shared/lib';
import { convert, getRate, getRates } from '@/shared/api/rates';
import { ErrorBanner, HeaderBar } from '@/shared/ui';
import { ConverterForm, ResultCard } from '@/features/convert/ui';

import styles from './styles.module.scss';

export default function App() {
  const {
    state: { from, to, amount },
    dispatch,
  } = useConverter();

  const amountDebounced = useDebouncedValue(amount, 250);

  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [ratesTs, setRatesTs] = useState<number>();

  async function loadRates(opts?: { force?: boolean; background?: boolean }) {
    if (!opts?.background) setLoading(true);
    setError(undefined);
    try {
      const { data, ts } = await getRates({ force: opts?.force });
      setRates(data.rates);
      setRatesTs(ts);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load rates';
      setError(msg);
    } finally {
      if (!opts?.background) setLoading(false);
    }
  }

  useEffect(() => {
    void loadRates();
  }, []);

  const handleRefresh = useThrottle(() => loadRates({ force: true }), REFRESH_THROTTLE_MS);
  const numAmount = toNumberSafe(amountDebounced);
  const canConvert = Number.isFinite(numAmount) && rates[from] && rates[to];

  useEffect(() => {
    if (!ratesTs) return;
    const msLeft = Math.max(CACHE_TTL_MS - (Date.now() - ratesTs), 0);

    const id = window.setTimeout(() => {
      void loadRates({ force: true, background: true });
    }, msLeft);

    return () => clearTimeout(id);
  }, [ratesTs]);

  const converted = useMemo(() => {
    if (!canConvert) return null;
    try {
      return convert(rates, from, to, numAmount);
    } catch {
      return null;
    }
  }, [canConvert, rates, from, to, numAmount]);

  const rate = useMemo(() => {
    if (!rates[from] || !rates[to]) return null;
    try {
      return getRate(rates, from, to);
    } catch {
      return null;
    }
  }, [rates, from, to]);

  const inverseRate = rate ? 1 / rate : null;

  return (
    <div className={styles.currencyWrapper}>
      <div className={styles.container}>
        <HeaderBar lastUpdatedTs={ratesTs} onRefresh={handleRefresh} loading={loading} />

        <ErrorBanner message={error} onRetry={handleRefresh} />

        <main className={styles.converter}>
          <ConverterForm
            from={from}
            to={to}
            onChangeFrom={(code) => dispatch({ type: 'setFrom', value: code })}
            onChangeTo={(code) => dispatch({ type: 'setTo', value: code })}
          />

          <ResultCard
            loading={loading}
            error={error}
            converted={converted}
            numAmount={numAmount}
            from={from}
            to={to}
            rate={rate}
            inverseRate={inverseRate}
          />
        </main>
      </div>
    </div>
  );
}
