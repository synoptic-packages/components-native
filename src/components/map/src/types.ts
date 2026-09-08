import type { ViewStyle } from 'react-native'

export type MapProvider = 'mapbox' | 'google' | 'webview'

export type MapCoordinate = {
	latitude: number
	longitude: number
}

export type MapMarkerVariant = 'origin' | 'destination' | 'driver' | 'rider' | 'queue' | 'point'

export type MapMarker = {
	id: string
	coordinate: MapCoordinate
	variant?: MapMarkerVariant
	color?: string
}

export type MapRouteProfile = 'driving' | 'driving-traffic'

export type MapRouteGeometry = {
	encoding: 'polyline5'
	value: string
}

export type MapBounds = {
	southWest: MapCoordinate
	northEast: MapCoordinate
}

export type MapEdgePadding =
	| number
	| {
			top: number
			right: number
			bottom: number
			left: number
	  }

export type MapRouteConfig = {
	// SERVER geometry is the authoritative route source when present: the decoded polyline5 is
	// rendered as the route line and its bounds frame the camera. The client never fetches a route.
	geometry?: MapRouteGeometry
	bounds?: MapBounds
	// Legacy point fields are retained so existing typings keep compiling; they no longer drive a
	// client-direct directions fetch and are ignored for the route line when `geometry` is present.
	from?: MapCoordinate
	to?: MapCoordinate
	waypoints?: MapCoordinate[]
	profile?: MapRouteProfile
	color?: string
	width?: number
	animate?: boolean
	fitBounds?: boolean
	fitPadding?: MapEdgePadding
	showMarkers?: boolean
	startMarkerColor?: string
	endMarkerColor?: string
}

export type MapHandle = {
	flyTo: (coordinate: MapCoordinate, durationMs?: number) => void
	fitBounds: (coordinates: MapCoordinate[], padding?: MapEdgePadding) => void
	getUserLocation: () => MapCoordinate | null
	/** Wherever the camera is centred right now — a pan target for a fixed-pin picker to read on confirm. */
	getCenter: () => MapCoordinate | null
}

export type MapProps = {
	provider?: MapProvider
	center?: MapCoordinate
	zoom?: number
	webviewUrl?: string
	showUserLocation?: boolean
	followUserLocation?: boolean
	pulseUserLocation?: boolean
	markers?: MapMarker[]
	route?: MapRouteConfig
	showRecenter?: boolean
	recenterStyle?: ViewStyle
	/** Identifies the map surface so a flow can prove which screen's map is mounted. */
	testID?: string
	/** Identifies the recenter control. */
	recenterTestID?: string
	/** Called after the user's own recenter tap, so the screen can restore its base camera mode. */
	onRecenter?: () => void
	/**
	 * When false, a recenter tap only reports through `onRecenter` and moves no camera — the owning
	 * frame drives the route-aware restore itself (047 §D1). Default true: standalone maps (home)
	 * keep the fly-to-user behavior.
	 */
	recenterFliesToUser?: boolean
	/** Evidence maps are non-interactive: the map is a record, not a thing to drive. */
	interactive?: boolean
	/** Fires only when the USER moved the camera — never for a programmatic fly/fit. */
	onUserPan?: () => void
	/** Identifies the renderer-unavailable state so a flow can assert the degraded path. */
	unavailableTestID?: string
	cameraPadding?: MapEdgePadding
	onMapRef?: (handle: MapHandle | null) => void
	onUserLocationChange?: (coordinate: MapCoordinate) => void
	style?: ViewStyle
}
