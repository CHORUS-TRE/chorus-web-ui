/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  trailingComma: 'none',
  printWidth: 80
}

export default config
