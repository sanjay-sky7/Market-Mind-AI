/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0f2044', 2: '#1a3c6e' },
        blue:   { DEFAULT: '#2756a8', 2: '#3b7dd8' },
        accent: { DEFAULT: '#00c875', 2: '#00a85a', light: '#e6faf3' },
        gold:   { DEFAULT: '#f5a623', light: '#fef8ed' },
        danger: { DEFAULT: '#e03152', light: '#fdeef2' },
        purple: { DEFAULT: '#7c3aed', light: '#f3f0ff' },
        teal:   { DEFAULT: '#0891b2', light: '#e0f2f7' },
        surface:'#f8fafd',
        border: '#e2e8f4',
        border2:'#c8d5eb',
        muted:  '#7b93b8',
      },
      fontFamily: {
        display:['"Playfair Display"','serif'],
        sans:   ['"Plus Jakarta Sans"','sans-serif'],
        mono:   ['"JetBrains Mono"','monospace'],
      },
      boxShadow: {
        sm:   '0 1px 4px rgba(15,32,68,0.06)',
        card: '0 4px 16px rgba(15,32,68,0.08)',
        md:   '0 8px 32px rgba(15,32,68,0.12)',
        lg:   '0 20px 60px rgba(15,32,68,0.16)',
        glow: '0 0 20px rgba(0,200,117,0.25)',
      },
    }
  },
  plugins: []
}
