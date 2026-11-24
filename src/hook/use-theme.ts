import { useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

export type Theme = 'light' | 'dark';

// keep in sync with the inline script in index.html
export const themeStorageKey = 'theme';

const lightMediaQuery = '(prefers-color-scheme: light)';

const readThemePreference = (): ThemePreference => {
  try {
    const value = window.localStorage.getItem(themeStorageKey);

    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
};

const writeThemePreference = (preference: ThemePreference): void => {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(themeStorageKey);
    } else {
      window.localStorage.setItem(themeStorageKey, preference);
    }
  } catch {
    // storage may be unavailable (e.g. private mode), the choice then lasts for this page view only
  }
};

const resolveTheme = (preference: ThemePreference, media: MediaQueryList): Theme => {
  if (preference !== 'system') {
    return preference;
  }

  return media.matches ? 'light' : 'dark';
};

export const useTheme = (): [ThemePreference, (preference: ThemePreference) => void] => {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference);

  useEffect(() => {
    const media = window.matchMedia(lightMediaQuery);

    const applyTheme = (): void => {
      document.documentElement.setAttribute('data-theme', resolveTheme(preference, media));
    };

    applyTheme();
    writeThemePreference(preference);

    // follow the system setting live, as long as the visitor did not pick a theme
    if (preference !== 'system') {
      return;
    }

    media.addEventListener('change', applyTheme);

    return () => media.removeEventListener('change', applyTheme);
  }, [preference]);

  return [preference, setPreference];
};
