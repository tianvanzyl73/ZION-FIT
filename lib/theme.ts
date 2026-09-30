import { useColorScheme } from 'react-native';
import { useStore } from './store';

export const YELLOW = '#FACC15';

const dark = {
  mode: 'dark' as const,
  bg: '#080808',
  card: '#141416',
  card2: '#1C1C1F',
  border: '#27272A',
  text: '#FAFAFA',
  sub: '#A1A1AA',
  muted: '#71717A',
  accent: YELLOW,
  onAccent: '#0A0A0A',
  green: '#34D399',
  red: '#F87171',
  blue: '#60A5FA',
  purple: '#C084FC',
  orange: '#FB923C',
};

const light: typeof dark = {
  mode: 'light' as any,
  bg: '#F4F4F5',
  card: '#FFFFFF',
  card2: '#F4F4F5',
  border: '#E4E4E7',
  text: '#0A0A0A',
  sub: '#52525B',
  muted: '#A1A1AA',
  accent: '#EAB308',
  onAccent: '#0A0A0A',
  green: '#059669',
  red: '#DC2626',
  blue: '#2563EB',
  purple: '#9333EA',
  orange: '#EA580C',
};

export type Colors = typeof dark;

export function useColors(): Colors {
  const sys = useColorScheme();
  const { state } = useStore();
  const t = state.settings.theme;
  const isDark = t === 'dark' || (t === 'system' && sys !== 'light');
  return isDark ? dark : light;
}

export const HEAD = 'Anton_400Regular';
