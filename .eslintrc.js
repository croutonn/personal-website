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
        '@typescript-eslint/consistent-type-imports': ['error'],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
            prefix: ['I'],
            filter: {
              regex: '^(Falsy|Maybe\\w*|Nullish)$',
              match: false,
            },
          },
          {
            selector: ['class', 'typeParameter'],
            format: ['PascalCase'],
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
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['*.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
