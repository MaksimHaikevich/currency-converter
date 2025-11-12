import currencies from '@/entities/currency/data/currencies.json';
import type { CurrencyOption } from './types';

export function allCurrencies(): CurrencyOption[] {
  return currencies as CurrencyOption[];
}

export function findCurrency(code: string): CurrencyOption | undefined {
  return allCurrencies().find((c) => c.code === code);
}

export function filterByQuery(query: string): CurrencyOption[] {
  const s = query.trim().toLowerCase();
  if (!s) return allCurrencies();
  return allCurrencies().filter(
    (c) => c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s),
  );
}
