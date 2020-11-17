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
        'no-underscore-dangle': [
          'error',
          {
            allow: ['__typename'],
            allowFunctionParams: true,
          },
        ],
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
      files: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
      rules: {
        'react/jsx-pascal-case': 'off',
        'react/jsx-props-no-spreading': 'off',
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
