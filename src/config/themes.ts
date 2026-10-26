import type { ThemeName } from './types';

export interface ThemeTokens {
  'color-bg': string;
  'color-bg-alt': string;
  'color-surface': string;
  'color-text': string;
  'color-text-muted': string;
  'color-border': string;
  'color-primary': string;
  'color-primary-fg': string;
  'color-accent': string;
  'color-accent-fg': string;
  'color-success': string;
  'color-warning': string;
  'color-warning-bg': string;
  'color-warning-fg': string;
  'color-error': string;
  'font-display': string;
  'font-sans': string;
  'radius-sm': string;
  'radius-md': string;
  'radius-lg': string;
  'radius-full': string;
  'motion-intensity': string;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  atelier: {
    'color-bg': '#faf8f4',
    'color-bg-alt': '#f3efe7',
    'color-surface': '#ffffff',
    'color-text': '#1c1916',
    'color-text-muted': '#6b6358',
    'color-border': '#e2dccf',
    'color-primary': '#1c1916',
    'color-primary-fg': '#faf8f4',
    'color-accent': '#a8593a',
    'color-accent-fg': '#ffffff',
    'color-success': '#5a7a4e',
    'color-warning': '#b07a2e',
    'color-warning-bg': '#f5ede0',
    'color-warning-fg': '#7a5520',
    'color-error': '#a23b2e',
    'font-display': '"Fraunces Variable", serif',
    'font-sans': '"Plus Jakarta Sans Variable", sans-serif',
    'radius-sm': '2px',
    'radius-md': '4px',
    'radius-lg': '8px',
    'radius-full': '9999px',
    'motion-intensity': '0.35',
  },
  gelato: {
    'color-bg': '#fbf7ff',
    'color-bg-alt': '#f2ecff',
    'color-surface': '#ffffff',
    'color-text': '#1a1330',
    'color-text-muted': '#5c4d7a',
    'color-border': '#e0d7f5',
    'color-primary': '#1a1330',
    'color-primary-fg': '#fbf7ff',
    'color-accent': '#7c3aed',
    'color-accent-fg': '#ffffff',
    'color-success': '#16a34a',
    'color-warning': '#d97706',
    'color-warning-bg': '#fef3c7',
    'color-warning-fg': '#92400e',
    'color-error': '#dc2626',
    'font-display': '"Cormorant Variable", serif',
    'font-sans': '"Manrope Variable", sans-serif',
    'radius-sm': '4px',
    'radius-md': '10px',
    'radius-lg': '18px',
    'radius-full': '9999px',
    'motion-intensity': '0.7',
  },
  forno: {
    'color-bg': '#faf6ef',
    'color-bg-alt': '#f0e8d8',
    'color-surface': '#fffdf8',
    'color-text': '#241a12',
    'color-text-muted': '#6e5d4a',
    'color-border': '#e6dcc6',
    'color-primary': '#241a12',
    'color-primary-fg': '#faf6ef',
    'color-accent': '#b8651a',
    'color-accent-fg': '#ffffff',
    'color-success': '#4d7a3a',
    'color-warning': '#c08a24',
    'color-warning-bg': '#f5ead4',
    'color-warning-fg': '#8a6118',
    'color-error': '#9a3520',
    'font-display': '"Space Grotesk Variable", sans-serif',
    'font-sans': '"Archivo Variable", sans-serif',
    'radius-sm': '3px',
    'radius-md': '6px',
    'radius-lg': '12px',
    'radius-full': '9999px',
    'motion-intensity': '0.5',
  },
};

export function themeStyle(name: ThemeName): string {
  const tokens = themes[name];
  const entries = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`);
  return `:root {\n${entries.join('\n')}\n}`;
}
