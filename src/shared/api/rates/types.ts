export type RatesMap = Record<string, number>;

export interface RatesResponse {
  date?: string;
  base: string;
  rates: RatesMap;
}

export interface CachedRates {
  payload: RatesResponse;
  timestamp: number;
}

export interface RatesResult {
  data: RatesResponse;
  fromCache: boolean;
  ts: number;
}

export interface FxRatesApiResponse {
  base: string;
  date?: string;
  rates: Record<string, number | string>;
}

export function isFxRatesApiResponse(value: unknown): value is FxRatesApiResponse {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  const hasBase = typeof obj.base === 'string';
  const hasDate = obj.date == null || typeof obj.date === 'string';
  const hasRates = !!obj.rates && typeof obj.rates === 'object';
  return hasBase && hasDate && hasRates;
}

export interface HttpErrorLike extends Error {
  code: 'HTTP_ERROR';
  status: number;
  body?: string;
}

export interface GetRatesOptions {
  base?: string;
  force?: boolean;
}
