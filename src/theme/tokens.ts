export const colors = {
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C43',
  textMuted: '#8E8E93',
  textSubtle: '#AEAEB2',
  primary: '#007AFF',
  primaryDark: '#0051D5',
  border: '#E5E5EA',
  borderStrong: '#D1D1D6',
  errorBg: '#FEF2F2',
  errorText: '#B91C1C',
  warnBg: '#FFFBEB',
  warnText: '#B45309',
  offlineBar: '#1E293B',
  offlineBarText: '#F8FAFC',
  link: '#007AFF',
  skeleton: '#E2E8F0',
  skeletonMuted: '#F1F5F9',
  chipBg: '#E8F1FF',
  chipBorder: '#B8D4FF',
  headerIconBg: '#EFEFF4',
  destructive: '#DC2626',
  destructivePressed: '#B91C1C',
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  headline: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  overline: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.6 },
} as const;
