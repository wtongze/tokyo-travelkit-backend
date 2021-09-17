module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
