module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    'react-native/react-native': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-native',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'linebreak-style': ['error', 'windows'],
    'no-use-before-define': 0,
  },
};
