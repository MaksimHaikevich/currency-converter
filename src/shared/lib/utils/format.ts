export function sanitizeAmountInput(input: string): string {
  if (!input) return '';

  const MAX_INTEGER_DIGITS = 15;
  const MAX_FRACTION_DIGITS = 10;

  const whitelisted = input.replace(/[^\d.,]/g, '');

  let result = '';
  let chosenSeparator: '.' | ',' | null = null;

  for (const char of whitelisted) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if ((char === '.' || char === ',') && chosenSeparator === null) {
      chosenSeparator = char;
      result += char;
    }
  }

  if (result.startsWith('.') || result.startsWith(',')) {
    result = '0' + result;
  }

  if (!result) return '';

  if (!chosenSeparator) {
    return result.slice(0, MAX_INTEGER_DIGITS);
  }

  const endsWithSeparator = result.endsWith(chosenSeparator);

  const [intRaw, fracRaw = ''] = result.split(chosenSeparator);

  const intLimited = intRaw.slice(0, MAX_INTEGER_DIGITS);
  const fracLimited = fracRaw.slice(0, MAX_FRACTION_DIGITS);

  if (fracLimited.length > 0) {
    return `${intLimited}${chosenSeparator}${fracLimited}`;
  }

  return endsWithSeparator && MAX_FRACTION_DIGITS > 0
    ? `${intLimited}${chosenSeparator}`
    : intLimited;
}

export function toNumberSafe(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return NaN;
  if (typeof input === 'number') return input;

  const trimmed = String(input).trim();
  if (!trimmed) return NaN;

  const withDot = trimmed.replace(/,/g, '.');

  const [intPart, ...rest] = withDot.split('.');
  const canonical = rest.length > 0 ? `${intPart}.${rest.join('')}` : intPart;

  const numeric = Number(canonical);
  return Number.isFinite(numeric) ? numeric : NaN;
}

export function formatNumber(value: number, currencyCode?: string): string {
  if (!Number.isFinite(value)) return '';

  try {
    if (currencyCode) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(value);
    }

    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  } catch {
    return String(value);
  }
}
