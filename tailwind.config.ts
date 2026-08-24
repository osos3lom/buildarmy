import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-el': 'var(--bg-el)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        label: 'var(--label)',
        'label-2': 'var(--label-2)',
        'label-3': 'var(--label-3)',
        'label-4': 'var(--label-4)',
        sep: 'var(--sep)',
        'sep-op': 'var(--sep-op)',
        acc: 'var(--acc)',
        'acc-2': 'var(--acc-2)',
        'on-acc': 'var(--on-acc)',
        'acc-soft': 'var(--acc-soft)',
        'acc-line': 'var(--acc-line)',
      },
      borderRadius: {
        'sm': 'var(--r-sm)',
        'DEFAULT': 'var(--r)',
        'lg': 'var(--r-lg)',
        'xl': 'var(--r-xl)',
        'card': 'var(--r-card)',
      },
      transitionDuration: {
        'fast': 'var(--fast)',
        'med': 'var(--med)',
      }
    },
  },
  plugins: [],
} satisfies Config
