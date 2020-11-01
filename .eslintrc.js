module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  extends: ['@croutonn'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/export': 'off',
        'import/group-exports': 'off',
      },
    },
    {
      files: ['stories/**/*.ts', 'stories/**/*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['src/services/*/graphql.ts'],
      rules: {
        'no-irregular-whitespace': 'off',
        'import/exports-last': 'off',
        'import/group-exports': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
