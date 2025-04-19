module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'node/no-unpublished-require': ['error', {
      allowModules: ['electron', 'spectron']
    }],
    'no-unused-vars': ['warn'],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
};
