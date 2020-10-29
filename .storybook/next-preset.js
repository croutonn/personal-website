const path = require('path')
const srcDir = path.resolve(__dirname, '../src')

module.exports = {
  webpackFinal: async (baseConfig, options) => {
    const { module = {} } = baseConfig

    const newConfig = {
      ...baseConfig,
      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    }

    // TypeScript with Next.js
    newConfig.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [srcDir],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel', require.resolve('babel-preset-react-app')],
            plugins: ['react-docgen'],
          },
        },
      ],
    })
    newConfig.resolve.extensions.push('.ts', '.tsx')

    return newConfig
  },
}
