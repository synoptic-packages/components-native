import type { MapProvider } from './types'

export interface MapBuildConfig {
	/** Build-time Mapbox token (was `constants.extra.mapbox_access_token`). */
	mapboxAccessToken?: string
	/** Build-time Google key (was `constants.extra.google_maps_api_key`). */
	googleMapsApiKey?: string
	/** Baked default renderer (was `constants.extra.ehailing_map_provider`). */
	defaultProvider?: MapProvider
}

let buildConfig: MapBuildConfig = {}

/**
 * Hosts call this once at startup with their build-time map credentials, e.g.
 * from expo-constants `extra`. The store cannot read app config itself — a
 * shared package must not import the host's constants module.
 */
export const configureMap = (config: MapBuildConfig): void => {
	buildConfig = { ...buildConfig, ...config }
}

/** The credentials currently configured (renderer components read tokens through here). */
export const mapBuildConfigGet = (): MapBuildConfig => buildConfig

/**
 * Which renderer draws maps, and who gets to decide.
 *
 * `be/` returns `runtime.mapRenderer.mobile.primary` from Parse.Config, so an operator changes the
 * renderer in the dashboard and the next bootstrap carries it — no code change, no release, and no
 * native rebuild. Until 2026-08-01 the backend returned that value and NO client read it: the choice
 * came from `constants.extra.ehailing_map_provider`, baked at build time from `EXPO_PUBLIC_MAP_PROVIDER`.
 * So the setting looked configurable from the server and was not.
 *
 * This is an external store rather than a React context on purpose. `Map` is a leaf shared component
 * used across compartments; a context would mean mounting a provider above every one of them, and the
 * value is genuinely one-per-session. `useSyncExternalStore` still re-renders every mounted map when
 * the bootstrap lands, which a module-level variable would not.
 */

const listeners = new Set<() => void>()
let serverRenderer: MapProvider | null = null

const MAP_PROVIDERS: MapProvider[] = ['mapbox', 'google', 'webview']

/**
 * Can THIS BUILD actually draw with that renderer?
 *
 * The server names a renderer; the binary either carries what it needs or it does not. Mapbox needs
 * `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` at build time AND the tenant's `features` list to include
 * `mapbox`, which is what adds the `@rnmapbox/maps` config plugin; Google needs
 * `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`, which is what writes `GMSApiKey` into the native project. Both
 * land in `extra` only when they were present, so `extra` is an honest record of what this build can
 * do.
 *
 * Without this check a server-side switch is a remote kill switch for the map: instruct a
 * Mapbox-only build to render Google and every rider gets a blank rectangle, with no way to recover
 * short of a store release. A renderer the build cannot honour is ignored, and the build keeps
 * drawing with what it has.
 *
 * `webview` needs no native credential — it is an HTML map in a WebView — so it is always available.
 */
export const mapRendererBuildSupports = (provider: MapProvider): boolean => {
	if (provider === 'webview') return true
	if (provider === 'google') return Boolean(buildConfig.googleMapsApiKey)
	return Boolean(buildConfig.mapboxAccessToken)
}

/** The renderer baked into this build, used when the server has not said otherwise. */
export const mapRendererBaked = (): MapProvider => {
	const runtime = buildConfig.defaultProvider
	return MAP_PROVIDERS.includes(runtime as MapProvider) ? (runtime as MapProvider) : 'mapbox'
}

/**
 * Record what the server asked for. Called from the compartment bootstrap.
 *
 * An unrecognised or unsupported value is stored as `null` rather than thrown away silently-but-
 * differently: `null` means "no server opinion this build can act on", which is exactly how an absent
 * value behaves, so a bad dashboard entry degrades to the baked renderer instead of a broken map.
 */
export const mapRendererServerSet = (provider: string | null | undefined): void => {
	const candidate = MAP_PROVIDERS.includes(provider as MapProvider) ? (provider as MapProvider) : null
	const next = candidate && mapRendererBuildSupports(candidate) ? candidate : null
	if (next === serverRenderer) return
	serverRenderer = next
	for (const listener of listeners) listener()
}

export const mapRendererServerGet = (): MapProvider | null => serverRenderer

export const mapRendererSubscribe = (listener: () => void): (() => void) => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

/** Tests only — the store outlives a single render tree. */
export const mapRendererReset = (): void => {
	serverRenderer = null
	buildConfig = {}
	listeners.clear()
}
