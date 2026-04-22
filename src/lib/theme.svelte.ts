import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

class ThemeManager {
    #currentTheme = $state<Theme>('system');

    constructor() {
        if (browser) {
            const saved = localStorage.getItem('theme') as Theme;
            if (saved) {
                this.#currentTheme = saved;
            }
            this.applyTheme();
        }
    }

    get current() {
        return this.#currentTheme;
    }

    set theme(value: Theme) {
        this.#currentTheme = value;
        if (browser) {
            localStorage.setItem('theme', value);
            this.applyTheme();
        }
    }

    private applyTheme() {
        if (!browser) return;

        const isDark =
            this.#currentTheme === 'dark' ||
            (this.#currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', this.#currentTheme === 'light');

        if (this.#currentTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                if (this.#currentTheme === 'system') {
                    document.documentElement.classList.toggle('dark', mediaQuery.matches);
                }
            };
            mediaQuery.addEventListener('change', handleChange, { once: true });
        }
    }
}

export const themeManager = new ThemeManager();
