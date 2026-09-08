import { forwardRef, useSyncExternalStore } from 'react'
import { Component as MapGoogle } from './Component.google'
import { Component as MapMapbox } from './Component.mapbox'
import { Component as MapWebview } from './Component.webview'
import { mapRendererBaked, mapRendererServerGet, mapRendererSubscribe } from './rendererStore'
import type { MapHandle, MapProps, MapProvider } from './types'

/**
 * The renderer, in precedence order:
 *
 * 1. An explicit `provider` prop — a caller that must pin one (a story, a test, a surface that only
 *    one renderer can express).
 * 2. What the SERVER asked for, if this build can honour it. `be/` resolves it from Parse.Config, so
 *    it is changeable per service in the dashboard with no deploy and no native rebuild.
 * 3. What was baked into the build.
 *
 * See `rendererStore.ts` for why a server instruction the build has no credentials for is ignored
 * rather than obeyed.
 */
const useResolvedProvider = (override?: MapProvider): MapProvider => {
	const fromServer = useSyncExternalStore(mapRendererSubscribe, mapRendererServerGet, mapRendererServerGet)
	if (override) return override
	return fromServer ?? mapRendererBaked()
}

export const Component = forwardRef<MapHandle, MapProps>(function Map(props, ref) {
	const provider = useResolvedProvider(props.provider)
	if (provider === 'google') return <MapGoogle ref={ref} {...props} />
	if (provider === 'webview') return <MapWebview ref={ref} {...props} />
	return <MapMapbox ref={ref} {...props} />
})

Component.displayName = 'Map'
