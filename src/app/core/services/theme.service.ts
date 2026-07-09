import { Injectable, signal, computed, effect} from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

export type EffectiveTheme = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {

  private readonly STORAGE_KEY = 'theme';

  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  private readonly systemDarkMode = signal(this.mediaQuery.matches);

  readonly currentTheme = signal<ThemeMode>('system');

  readonly effectiveTheme = computed(() => {

        if (this.currentTheme() === 'light') {
            return 'light';
        }

        if (this.currentTheme() === 'dark') {
            return 'dark';
        }

    return this.systemDarkMode() ? 'dark' : 'light';

  });

  readonly isDark = computed(() => this.effectiveTheme() === 'dark');

  constructor() {

    this.loadTheme();

    effect(() => {

      const theme = this.currentTheme();

      localStorage.setItem(this.STORAGE_KEY, theme);

    });

    effect(() => {

      const theme = this.effectiveTheme();

      document.body.classList.remove(
        'light-theme',
        'dark-theme'
      );

      document.body.classList.add(
        `${theme}-theme`
      );

    });

    this.mediaQuery.addEventListener('change', event => {
        this.systemDarkMode.set(event.matches);
        }
    );
  }

  setLight(): void {
    this.currentTheme.set('light');
  }

  setDark(): void {
    this.currentTheme.set('dark');
  }

  setSystem(): void {
    this.currentTheme.set('system');
  }

  toggle(): void {

    if (this.isDark()) {
      this.setLight();
    } else {
      this.setDark();
    }

  }

  private loadTheme(): void {

    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      this.currentTheme.set(saved);
    }

  }
}