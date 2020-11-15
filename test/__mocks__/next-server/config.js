const { resolve } = require('path')

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const loadConfig = require('next/dist/next-server/server/config').default

const config = loadConfig(
  PHASE_DEVELOPMENT_SERVER,
  resolve(__dirname, '../../../')
)

module.exports = () => ({
  publicRuntimeConfig: config.publicRuntimeConfig,
  serverRuntimeConfig: config.serverRuntimeConfig,
})
