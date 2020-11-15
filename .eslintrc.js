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
      rules: {
        'react/jsx-props-no-spreading': [
          'error',
          {
            html: 'enforce',
            custom: 'enforce',
            explicitSpread: 'ignore',
            exceptions: ['Component', 'props.Component', 'NextSeo'],
          },
        ],
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
      files: ['src/services/*/graphql.ts'],
      rules: {
        'no-irregular-whitespace': 'off',
        '@croutonn/exports-last': 'off',
        '@croutonn/group-exports': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
