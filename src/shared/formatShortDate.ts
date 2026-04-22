export function formatShortDate(timestampSeconds: number, locale = 'en-US'): string {
  return new Date(timestampSeconds * 1000).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
