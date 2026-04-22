import { faviconUrlForDomain, sourceDomainFromUrl } from '../src/features/news/model/domainFromUrl';

describe('sourceDomainFromUrl', () => {
  it('returns hostname without scheme', () => {
    expect(sourceDomainFromUrl('https://news.ycombinator.com/item?id=1')).toBe('news.ycombinator.com');
  });

  it('strips a leading www.', () => {
    expect(sourceDomainFromUrl('https://www.github.com/foo')).toBe('github.com');
  });

  it('adds https when the scheme is missing', () => {
    expect(sourceDomainFromUrl('example.com/path')).toBe('example.com');
  });
});

describe('faviconUrlForDomain', () => {
  it('builds the Google favicon helper URL', () => {
    expect(faviconUrlForDomain('github.com')).toBe(
      'https://www.google.com/s2/favicons?domain=github.com&sz=64',
    );
  });

  it('returns empty string for blank domain', () => {
    expect(faviconUrlForDomain('  ')).toBe('');
  });
});
