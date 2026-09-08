import assert from 'node:assert/strict'
import test from 'node:test'

import {
	configureMap,
	mapRendererBaked,
	mapRendererBuildSupports,
	mapRendererReset,
	mapRendererServerGet,
	mapRendererServerSet,
} from '../src/components/map/src/rendererStore.ts'

// The renderer store is pure module state (no React Native imports), so it is
// unit-covered here rather than on-device: the whole point of the store is
// that a server instruction this build cannot honour degrades instead of
// blanking every rider's map.

test('baked renderer defaults to mapbox with no config', () => {
	mapRendererReset()
	assert.equal(mapRendererBaked(), 'mapbox')
	assert.equal(mapRendererServerGet(), null)
})

test('configureMap drives baked renderer and capability checks', () => {
	mapRendererReset()
	configureMap({ defaultProvider: 'google', googleMapsApiKey: 'key' })
	assert.equal(mapRendererBaked(), 'google')
	assert.equal(mapRendererBuildSupports('google'), true)
	assert.equal(mapRendererBuildSupports('mapbox'), false)
	assert.equal(mapRendererBuildSupports('webview'), true)
	mapRendererReset()
})

test('a server instruction the build cannot honour is ignored, not obeyed', () => {
	mapRendererReset()
	configureMap({ mapboxAccessToken: 'token' })
	mapRendererServerSet('google')
	assert.equal(mapRendererServerGet(), null)
	mapRendererReset()
})

test('a supportable server instruction wins over the baked renderer', () => {
	mapRendererReset()
	configureMap({ mapboxAccessToken: 'token' })
	mapRendererServerSet('mapbox')
	assert.equal(mapRendererServerGet(), 'mapbox')
	mapRendererReset()
})

test('garbage server values degrade to no opinion', () => {
	mapRendererReset()
	configureMap({ mapboxAccessToken: 'token' })
	mapRendererServerSet('apple-maps')
	assert.equal(mapRendererServerGet(), null)
	mapRendererReset()
})
