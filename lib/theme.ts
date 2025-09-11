import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
 
export const THEME = {
  light: {
    // Background and Surface Colors
    background: 'hsl(210 20% 98%)', // Our #F8FAFC
    foreground: 'hsl(215 28% 17%)', // Our Dark Text #1F2937
    card: 'hsl(210 20% 98%)',
    cardForeground: 'hsl(215 28% 17%)',
    popover: 'hsl(210 20% 98%)',
    popoverForeground: 'hsl(215 28% 17%)',

    // Primary & Accent Colors
    primary: 'hsl(163 94% 24%)', // Our Primary Green #047857
    primaryForeground: 'hsl(0 0% 98%)', // A bright white for contrast on the primary color
    secondary: 'hsl(224 64% 33%)', // Our Primary Blue #1E3A8A
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(220 9% 46%)', // Our Subtle Text #6B7280
    mutedForeground: 'hsl(220 9% 46%)',
    accent: 'hsl(180 100% 36%)', // Our Secondary Teal #00B5B5
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 72% 51%)', // Our Accent Red #DC2626
    border: 'hsl(220 13% 91%)', // Our Border & Divider #E5E7EB
    input: 'hsl(220 13% 91%)',
    ring: 'hsl(215 28% 17%)',

    // Other settings
    radius: '0.625rem',
    chart1: 'hsl(163 94% 24%)',
    chart2: 'hsl(224 64% 33%)',
    chart3: 'hsl(180 100% 36%)',
    chart4: 'hsl(0 72% 51%)',
    chart5: 'hsl(215 28% 17%)',
  },
  dark: {
    // The dark theme colors are placeholders. You will need to define
    // a complementary dark palette for a great user experience.
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
  },
};
 
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};