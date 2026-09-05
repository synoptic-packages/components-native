// https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/config/metro.mdx
// Storybook v10: metro strips storybook modules from the bundle when `enabled`
// is false, so importing ./.rnstorybook in App.tsx is production-safe.
const { getDefaultConfig } = require('expo/metro-config')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')
const path = require('path')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

module.exports = withStorybook(config, {
	configPath: path.resolve(projectRoot, './.rnstorybook'),
	enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
})
