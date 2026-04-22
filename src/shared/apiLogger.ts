const BR = '\n────────────────────────────────────────';

function stamp(): string {
  return new Date().toISOString();
}

function safeJson(value: unknown, maxChars: number): string {
  try {
    const s = JSON.stringify(value, null, 2);
    if (s.length <= maxChars) {
      return s;
    }
    return `${s.slice(0, maxChars)}\n… (truncated, ${s.length} chars total)`;
  } catch {
    return String(value);
  }
}

export function logApiRequest(method: string, url: string): void {
  console.log(`${BR}\n[${stamp()}] ${method} ${url}`);
}

export function logApiResponse(url: string, status: number, statusText: string, ms: number, bodySummary: string): void {
  console.log(
    `[${stamp()}] ← ${status} ${statusText} in ${ms}ms\n${bodySummary}${BR}\n`,
  );
}

export function logApiError(url: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.log(`[${stamp()}] ✗ ${url}\n   ${msg}${BR}\n`);
}

export function summarizeTopStoryIds(ids: unknown): string {
  if (!Array.isArray(ids)) {
    return safeJson(ids, 800);
  }
  const nums = ids.filter((x): x is number => typeof x === 'number');
  const preview = nums.slice(0, 30);
  return `type: number[]\nlength: ${nums.length}\nfirst 30 ids: ${JSON.stringify(preview)}${
    nums.length > 30 ? '\n…' : ''
  }\n(app uses first 20 for the feed)`;
}

export function summarizeItemPayload(raw: unknown): string {
  if (raw === null || raw === undefined) {
    return String(raw);
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const keys = Object.keys(o).sort();
    const pick = ['id', 'type', 'by', 'time', 'title', 'url', 'score', 'descendants', 'kids'];
    const subset: Record<string, unknown> = {};
    for (const k of pick) {
      if (k in o) {
        const v = o[k];
        if (k === 'kids' && Array.isArray(v) && v.length > 5) {
          subset[k] = `[${v.length} comments] first: ${JSON.stringify(v.slice(0, 3))}…`;
        } else {
          subset[k] = v;
        }
      }
    }
    return safeJson({ _keys: keys, ...subset }, 4000);
  }
  return safeJson(raw, 2000);
}
