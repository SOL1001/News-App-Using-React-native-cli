const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
  ['second', 1],
];

function formatRelativeTimeFallback(timestampSeconds: number, nowMs: number): string {
  const nowSec = Math.floor(nowMs / 1000);
  const diffSec = nowSec - timestampSeconds;
  const abs = Math.abs(diffSec);
  const past = diffSec > 0;

  if (abs < 60) {
    return past ? 'just now' : 'soon';
  }
  if (abs < 3600) {
    const m = Math.floor(abs / 60);
    return past ? `${m} min ago` : `in ${m} min`;
  }
  if (abs < 86400) {
    const h = Math.floor(abs / 3600);
    return past ? `${h} hr ago` : `in ${h} hr`;
  }
  if (abs < 86400 * 7) {
    const d = Math.floor(abs / 86400);
    return past ? `${d} day${d === 1 ? '' : 's'} ago` : `in ${d} day${d === 1 ? '' : 's'}`;
  }
  const w = Math.floor(abs / (86400 * 7));
  return past ? `${w} wk ago` : `in ${w} wk`;
}

export function formatRelativeTime(timestampSeconds: number, nowMs: number = Date.now()): string {
  const RelativeTimeFormat = Intl.RelativeTimeFormat;
  if (typeof RelativeTimeFormat !== 'function') {
    return formatRelativeTimeFallback(timestampSeconds, nowMs);
  }

  const thenMs = timestampSeconds * 1000;
  const deltaSec = Math.round((thenMs - nowMs) / 1000);
  const rtf = new RelativeTimeFormat('en', { numeric: 'auto' });

  const abs = Math.abs(deltaSec);
  for (const [unit, secondsInUnit] of UNITS) {
    if (abs >= secondsInUnit || unit === 'second') {
      const value = Math.round(deltaSec / secondsInUnit);
      return rtf.format(value, unit);
    }
  }
  return rtf.format(0, 'second');
}
