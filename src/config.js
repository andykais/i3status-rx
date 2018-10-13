import { resolve } from 'path'
import { readFileSync } from 'fs'
import toml from 'toml'

const mergeBlockConfigs = (defaultConfig, userConfig) => {
  if (!userConfig) return defaultConfig.block
  return userConfig.block.map(b => ({
    ...defaultConfig.block.find(defaultBlock => defaultBlock.block === b.block),
    ...b
  }))
}

const parseConfig = tomlFile => {
  const tomlStr = readFileSync(tomlFile).toString()
  const config = toml.parse(tomlStr)

  return config
}

export default configFile => {
  const userConfig = configFile
    ? parseConfig(resolve(process.cwd(), configFile))
    : null

  const defaultConfig = parseConfig(
    resolve(__dirname, '../default-config.toml')
  )

  return {
    ...defaultConfig,
    ...userConfig,
    block: mergeBlockConfigs(defaultConfig, userConfig)
  }
}