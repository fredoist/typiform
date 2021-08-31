module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './containers/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/blocks.json',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
