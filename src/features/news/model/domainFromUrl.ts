export function sourceDomainFromUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const host = new URL(withProto).hostname;
    return host ? host.replace(/^www\./i, '') : trimmed;
  } catch {
    return trimmed.replace(/^https?:\/\//i, '').split('/')[0] ?? trimmed;
  }
}

export function faviconUrlForDomain(domain: string): string {
  const d = domain.trim();
  if (!d) {
    return '';
  }
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=64`;
}
