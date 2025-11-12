import type {
  RatesResponse,
  CachedRates,
  RatesResult,
  FxRatesApiResponse,
  HttpErrorLike,
  GetRatesOptions,
} from './types';
import { isFxRatesApiResponse } from './types';

import { CACHE_TTL_MS, loadJSON, LS_RATES, saveJSON } from '@/shared/lib';

const FX_BASE_URL = import.meta.env.VITE_RATES_BASE_URL as string | URL;
const API_KEY = import.meta.env.VITE_RATES_API_KEY as string | undefined;

function makeHttpError(status: number, statusText: string, body?: string): HttpErrorLike {
  const errorObject = new Error(`${status} ${statusText}`) as HttpErrorLike;
  errorObject.code = 'HTTP_ERROR';
  errorObject.status = status;
  if (body) errorObject.body = body;
  return errorObject;
}

async function fetchJson(
  urlString: string,
  init?: RequestInit,
  timeoutMs = 12_000,
): Promise<unknown> {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  try {
    const response = await fetch(urlString, {
      cache: 'no-store',
      ...init,
      signal: abortController.signal,
    });
    const responseText = await response.text().catch(() => '');

    if (!response.ok) {
      throw makeHttpError(response.status, response.statusText, responseText || undefined);
    }
    return responseText ? JSON.parse(responseText) : null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchRatesFx(base = 'EUR'): Promise<FxRatesApiResponse> {
  const url = new URL(FX_BASE_URL);
  url.searchParams.set('base', base);
  if (API_KEY) url.searchParams.set('apikey', API_KEY);

  const json = await fetchJson(url.toString());
  if (!isFxRatesApiResponse(json)) throw new Error('Malformed fxratesapi response');
  return json;
}

function normalizeFx(providerData: FxRatesApiResponse): RatesResponse {
  const normalizedRates: Record<string, number> = {};
  for (const [currencyCode, rateValue] of Object.entries(providerData.rates)) {
    const parsedRate = typeof rateValue === 'number' ? rateValue : Number(rateValue);
    if (Number.isFinite(parsedRate)) normalizedRates[currencyCode] = parsedRate;
  }
  return { base: providerData.base, date: providerData.date, rates: normalizedRates };
}

function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export async function getRates(opts: GetRatesOptions = {}): Promise<RatesResult> {
  const base = opts.base ?? 'EUR';
  const force = opts.force ?? false;

  const cached = loadJSON<CachedRates>(LS_RATES);
  const now = Date.now();

  if (!isOnline() && cached) {
    return { data: cached.payload, fromCache: true, ts: cached.timestamp };
  }

  const fresh = cached && now - cached.timestamp < CACHE_TTL_MS;
  if (!force && fresh) {
    return { data: cached.payload, fromCache: true, ts: cached.timestamp };
  }

  try {
    const providerResponse = await fetchRatesFx(base);
    const payload = normalizeFx(providerResponse);
    const ts = Date.now();
    saveJSON<CachedRates>(LS_RATES, { payload, timestamp: ts });
    return { data: payload, fromCache: false, ts };
  } catch (e) {
    if (cached) return { data: cached.payload, fromCache: true, ts: cached.timestamp };
    throw e;
  }
}

export function convert(
  rates: Record<string, number>,
  from: string,
  to: string,
  amount: number,
): number {
  if (!Number.isFinite(amount)) throw new Error('Bad amount');
  if (amount === 0 || from === to) return amount;
  if (!(from in rates) || !(to in rates)) throw new Error('Unknown currency code');

  const fromRate = rates[from]!;
  const toRate = rates[to]!;
  return amount * (toRate / fromRate);
}

export function getRate(rates: Record<string, number>, from: string, to: string): number {
  if (from === to) return 1;
  if (!(from in rates) || !(to in rates)) throw new Error('Unknown currency code');

  const fromRate = rates[from]!;
  const toRate = rates[to]!;
  return toRate / fromRate;
}
