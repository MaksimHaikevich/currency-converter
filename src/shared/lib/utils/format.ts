export function sanitizeAmountInput(input: string): string {
  if (!input) return '';

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

  return result;
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
