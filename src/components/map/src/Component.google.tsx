import { ErrorBoundary } from '../../error-boundary'
import { Icon } from '../../icon'
import { Pressable } from '../../pressable'
import { View } from '../../view'
import { mapBuildConfigGet } from './rendererStore'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import { decodePolyline5, googleZoomFor, mapEdgePaddingClamp, mapEdgePaddingResolve } from '@wallet/provider'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { StyleSheet, type ViewStyle } from 'react-native'
import MapView, {
	Marker,
	Polyline,
	PROVIDER_GOOGLE,
	type Details,
	type EdgePadding,
	type Region,
	type UserLocationChangeEvent,
} from 'react-native-maps'
import { googleNightStyle } from './googleNightStyle'
import { styles } from './styles'
import type { MapCoordinate, MapEdgePadding, MapHandle, MapMarker, MapProps } from './types'

const DEFAULT_ZOOM = 14
const ROUTE_WIDTH = 4
const ROUTE_CASING_WIDTH = ROUTE_WIDTH + 4

const MARKER_TOKEN_BY_VARIANT: Record<NonNullable<MapMarker['variant']>, ColorName> = {
	origin: 'success',
	destination: 'error',
	driver: 'primary',
	rider: 'accent',
	queue: 'warning',
	point: 'info',
}

const resolveApiKey = (): string => {
	const runtime = mapBuildConfigGet().googleMapsApiKey
	if (typeof runtime === 'string' && runtime.trim()) return runtime
	return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
}

const isFiniteCoordinate = (coordinate: MapCoordinate): boolean =>
	Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)

// Padding normalisation, the axis clamp and the zoom translation all live in `@wallet/provider`
// (`mapRendererGeometry`), shared with the Mapbox renderer and unit-tested there.
//
// They used to be copied into each renderer, and the copies drifted on the one number that matters:
// the clamp was raised to 80% here after a real defect — an `even` sheet covers 51% and the floating
// chrome asks for ~96pt more, so a 60% cap squashed the fit and put the route's endpoints, with the
// driver puck on one of them, underneath the sheet — and THIS file kept the pre-fix 60%. Switching a
// tenant to the Google renderer therefore reintroduced a bug that had already been found and fixed.
// One source is the fix; do not re-inline either constant.
const toEdgePadding = (padding: MapEdgePadding | undefined): EdgePadding => mapEdgePaddingResolve(padding)

const clampEdgePadding = (padding: EdgePadding, size: { width: number; height: number }): EdgePadding =>
	mapEdgePaddingClamp(padding, size)

// Custom-view markers on the Google renderer re-snapshot their view every frame while
// `tracksViewChanges` is true, which is expensive. The view is static after first render, so
// tracking settles to false shortly after mount and re-arms only when the signature (fill/size)
// changes and the snapshot genuinely needs refreshing.
const useTracksViewChanges = (signature: string): boolean => {
	const [tracksViewChanges, setTracksViewChanges] = useState(true)
	useEffect(() => {
		setTracksViewChanges(true)
		const timer = setTimeout(() => setTracksViewChanges(false), 500)
		return () => clearTimeout(timer)
	}, [signature])
	return tracksViewChanges
}

// No `testID` on the marker view, deliberately. The Mapbox renderer draws product markers as
// ShapeSource features rather than annotation views (a Fabric constraint, not a choice), so
// `map-marker-*` ids CANNOT exist in its native tree. Exposing them here made a flow that selects a
// marker pass under one renderer and fail under the other — and the three-tenant matrix cannot catch
// that, because the renderer is not a tenant axis. The testID contract belongs to `MapProps`, not to
// a renderer, so it is the Mapbox one: flows assert the sheet's live indicator instead. See
// `.maestro/TESTID_CONVENTION.md`.
const DriverMarker: React.FC<{ marker: MapMarker; shadowStyle: ViewStyle }> = ({ marker, shadowStyle }) => {
	const tracksViewChanges = useTracksViewChanges(marker.id)
	return (
		<Marker
			identifier={`map-marker-${marker.id}`}
			coordinate={marker.coordinate}
			anchor={{ x: 0.5, y: 0.5 }}
			tracksViewChanges={tracksViewChanges}>
			<View
				width={36}
				height={36}
				borderRadius={18}
				backgroundColor={`white`}
				alignItems={`center`}
				justifyContent={`center`}
				style={shadowStyle}>
				<Icon name={`CarTaxiFront`} size={22} color={`primary`} />
			</View>
		</Marker>
	)
}

const DotMarker: React.FC<{ id: string; coordinate: MapCoordinate; fill: string; size?: number }> = ({
	id,
	coordinate,
	fill,
	size = 20,
}) => {
	const tracksViewChanges = useTracksViewChanges(`${id}:${fill}:${size}`)
	return (
		<Marker
			identifier={id}
			coordinate={coordinate}
			anchor={{ x: 0.5, y: 0.5 }}
			tracksViewChanges={tracksViewChanges}>
			<View
				width={size}
				height={size}
				borderRadius={size / 2}
				backgroundColor={fill}
				borderWidth={3}
				borderColor={`white`}
			/>
		</Marker>
	)
}

// The Google renderer implements the full MapProps contract over react-native-maps. Two honest
// degradations against the Mapbox renderer: `pulseUserLocation` has no Google-provider pulse
// equivalent, so it renders nothing extra (the platform location dot still shows — we do not fake a
// pulse); and `route.animate` has no line-gradient primitive, so the route renders statically.
export const Component = forwardRef<MapHandle, MapProps>(function MapGoogle(
	{
		center,
		zoom = DEFAULT_ZOOM,
		showUserLocation = false,
		followUserLocation = false,
		markers,
		route,
		showRecenter = false,
		recenterStyle,
		recenterTestID,
		onRecenter,
		recenterFliesToUser = true,
		interactive = true,
		onUserPan,
		unavailableTestID,
		testID,
		cameraPadding,
		onMapRef,
		onUserLocationChange,
		style,
	},
	forwardedRef
) {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const mapRef = useRef<MapView | null>(null)
	const userCoordRef = useRef<MapCoordinate | null>(null)
	const centerRef = useRef<MapCoordinate | null>(center ?? null)
	const hasFramedUserRef = useRef(false)
	const apiKey = useMemo(resolveApiKey, [])

	// Measured by onLayout so fitBounds can clamp padding to the real viewport rather than assuming a
	// full-screen map. Zero until first layout, which clampEdgePadding treats as "no clamping possible".
	const sizeRef = useRef({ width: 0, height: 0 })

	const mapPadding = useMemo<EdgePadding | undefined>(() => {
		if (cameraPadding === undefined) return undefined
		return toEdgePadding(cameraPadding)
	}, [cameraPadding])

	// See the Mapbox renderer's identical comment: `cameraPadding` is a fresh object every render
	// for most callers (sheet-derived, not memoized), so `mapPadding` above is too — an effect keyed
	// on its identity would re-fire every render. This key serialises the values the follow-mode
	// effect (finding 0191) actually cares about.
	const followPaddingKey = useMemo(() => {
		if (!mapPadding) return 'none'
		const { top, right, bottom, left } = mapPadding
		return `${top},${right},${bottom},${left}`
	}, [mapPadding])

	const handle = useMemo<MapHandle>(
		() => ({
			flyTo: (coord, durationMs = 600) => {
				mapRef.current?.animateCamera({ center: coord }, { duration: durationMs })
			},
			fitBounds: (coords, padding) => {
				if (coords.length < 2) return
				mapRef.current?.fitToCoordinates(coords, {
					edgePadding: clampEdgePadding(toEdgePadding(padding), sizeRef.current),
					animated: true,
				})
			},
			getUserLocation: () => userCoordRef.current,
			getCenter: () => centerRef.current,
		}),
		[]
	)

	useImperativeHandle(forwardedRef, () => handle, [handle])

	useEffect(() => {
		onMapRef?.(handle)
		return () => onMapRef?.(null)
	}, [handle, onMapRef])

	// The route line is decoded once from the SERVER polyline5 geometry — the map never fetches a
	// route itself. Absent geometry means markers only (no line, no network request).
	const routeCoords = useMemo<MapCoordinate[] | null>(() => {
		if (route?.geometry?.encoding !== 'polyline5') return null
		const decoded = decodePolyline5(route.geometry.value)
		return decoded.length > 1 ? decoded : null
	}, [route?.geometry?.encoding, route?.geometry?.value])

	// Camera framing prefers the server-provided bounds; otherwise it falls back to the decoded
	// route coordinates' own bounds.
	const fitCoords = useMemo<MapCoordinate[] | null>(() => {
		if (route?.bounds) return [route.bounds.southWest, route.bounds.northEast]
		return routeCoords
	}, [route?.bounds, routeCoords])

	// `fitCoords` and `route?.fitPadding` are new object/array references on every render that passes
	// a freshly-built `route`, even when the underlying values did not change — keying the fit effect
	// on either reran the fly/fit on every render and fought any pan the rider made. `fitKey` and
	// `fitPaddingKey` serialise the values the effect actually cares about, so it only fires on a real
	// change; the refs below let it still read the CURRENT coordinates/padding when it does fire.
	const fitCoordsRef = useRef<MapCoordinate[] | null>(null)
	fitCoordsRef.current = fitCoords
	// Declarative padding, when present, already frames the fit — an UNSET imperative padding falls
	// back to the SDK's own structural default (`MAP_EDGE_PADDING_DEFAULT`), which compounds with the
	// declarative padding exactly the way an explicit non-zero `route.fitPadding` used to (finding
	// 0185, spec 047 §2 item 1) — the frame's OWN route object fixed its half by always passing `0`, but
	// a caller that passes markers with no `route` at all never had a `route.fitPadding` to fix, and
	// still hit this every time `cameraPadding` was set. `undefined` survives only for a caller with NO
	// declarative padding at all (an evidence/panel map with no `cameraPadding`), where the SDK's own
	// default is still the right one. Shared verbatim with the Mapbox renderer; keep the two in step.
	//
	// This renderer has no marker-fallback fit effect at all (the Mapbox renderer's `hasFramedMarkersRef`
	// below has no Google counterpart — a pre-existing renderer-parity gap, out of this fix's scope), so
	// `fitPaddingDefault` here only ever feeds the route-fit effect below.
	const fitPaddingDefault = cameraPadding !== undefined ? 0 : undefined
	const fitPaddingRef = useRef<MapEdgePadding | undefined>(undefined)
	fitPaddingRef.current = route?.fitPadding ?? fitPaddingDefault

	const fitKey = useMemo(() => {
		if (route?.bounds) {
			const { southWest, northEast } = route.bounds
			return `b:${southWest.latitude},${southWest.longitude},${northEast.latitude},${northEast.longitude}`
		}
		return route?.geometry?.value ? `g:${route.geometry.value}` : null
	}, [route?.bounds, route?.geometry?.value])

	const fitPaddingKey = useMemo(() => {
		const padding = route?.fitPadding ?? fitPaddingDefault
		if (padding === undefined) return 'default'
		if (typeof padding === 'number') return `${padding}`
		return `${padding.top},${padding.right},${padding.bottom},${padding.left}`
	}, [route?.fitPadding, fitPaddingDefault])

	useEffect(() => {
		const coords = fitCoordsRef.current
		if (!coords || coords.length < 2) return
		if (route?.fitBounds === false) return
		const padding = fitPaddingRef.current
		const timer = setTimeout(() => {
			handle.fitBounds(coords, padding)
		}, 300)
		return () => clearTimeout(timer)
	}, [handle, fitKey, route?.fitBounds, fitPaddingKey])

	// Mirrors the Mapbox renderer's controlled centerCoordinate/zoomLevel: a changed `center`/`zoom`
	// prop moves the camera, while unchanged values never re-animate.
	const lastCameraRef = useRef<{ latitude: number; longitude: number; zoom: number } | null>(
		center ? { latitude: center.latitude, longitude: center.longitude, zoom } : null
	)
	useEffect(() => {
		if (!center || !isFiniteCoordinate(center)) return
		const last = lastCameraRef.current
		lastCameraRef.current = { latitude: center.latitude, longitude: center.longitude, zoom }
		if (last && last.latitude === center.latitude && last.longitude === center.longitude && last.zoom === zoom)
			return
		mapRef.current?.animateCamera({ center, zoom: googleZoomFor(zoom) }, { duration: 600 })
	}, [center, zoom])

	const handleUserLocationChange = useCallback(
		(event: UserLocationChangeEvent) => {
			const coordinate = event.nativeEvent.coordinate
			if (!coordinate) return
			const coord = { latitude: coordinate.latitude, longitude: coordinate.longitude }
			if (!isFiniteCoordinate(coord)) return
			userCoordRef.current = coord
			onUserLocationChange?.(coord)
			if (followUserLocation) {
				// First fix frames at the requested zoom, later ones only pan — see the Mapbox renderer
				// for why: `animateCamera({center})` carries no zoom, so the level reached the camera
				// only through the mount-time camera and the result varied run to run.
				//
				// Finding 0191: this renderer's `animateCamera` takes no padding argument — the target
				// is placed within whichever `mapPadding` is CURRENTLY active on the `<MapView>` at call
				// time (Android's `CameraUpdateFactory.newLatLng` padding semantics), so no change is
				// needed here. The gap this finding measured on the Mapbox renderer is the COMPANION
				// case: a sheet move with no new fix never calls this handler at all, so nothing
				// re-anchors the puck when padding changes alone. The effect below mirrors the Mapbox
				// fix for that case.
				if (hasFramedUserRef.current) {
					mapRef.current?.animateCamera({ center: coord }, { duration: 600 })
				} else {
					hasFramedUserRef.current = true
					mapRef.current?.animateCamera({ center: coord, zoom: googleZoomFor(zoom) }, { duration: 600 })
				}
			}
		},
		[followUserLocation, onUserLocationChange, zoom]
	)

	// Finding 0191, companion half — mirrors the INTENT of the Mapbox renderer's equivalent effect,
	// which measured this gap on device, but not its body verbatim: a sheet drag/resize changes
	// `cameraPadding` with no new location fix to carry it through `handleUserLocationChange` above,
	// so a followed puck never re-anchors when the sheet grows. Re-issuing the camera move against the
	// LAST KNOWN coordinate whenever the effective padding actually changes (keyed on
	// `followPaddingKey`, not object identity) keeps it tracking. One honest difference: Mapbox's
	// effect body reads `cameraPaddingTuple` directly to pass an explicit `padding` to `setCamera`, and
	// needs its own `eslint-disable` for the resulting incomplete dependency array; this effect calls
	// `animateCamera({ center })` with no padding argument at all — the CURRENTLY active `mapPadding`
	// prop on the `<MapView>` supplies it, per Android's `CameraUpdateFactory.newLatLng` semantics — so
	// it never reads `cameraPaddingTuple`/`mapPadding` and needs no such suppression.
	useEffect(() => {
		if (!followUserLocation || !hasFramedUserRef.current) return
		const coord = userCoordRef.current
		if (!coord) return
		mapRef.current?.animateCamera({ center: coord }, { duration: 300 })
	}, [followUserLocation, followPaddingKey])

	const handleRecenter = useCallback(() => {
		if (recenterFliesToUser) {
			const coord = userCoordRef.current
			if (coord) mapRef.current?.animateCamera({ center: coord }, { duration: 600 })
		}
		onRecenter?.()
	}, [onRecenter, recenterFliesToUser])

	// Gesture-gated on purpose, twice over: onPanDrag only ever fires for user gestures (and needs
	// scroll gestures enabled, so it is wired only while interactive), and onUserPan below is guarded
	// by details.isGesture === true, which the Google provider reports. Neither path can fire for a
	// programmatic animateCamera/fitToCoordinates, so a fitBounds never breaks its own camera mode.
	const handlePanDrag = useMemo(() => {
		if (!interactive || !onUserPan) return undefined
		return () => onUserPan()
	}, [interactive, onUserPan])
	// UNGATED, unlike onUserPan above: centerRef tracks wherever the camera actually is, programmatic
	// moves included, so a fixed-pin picker's getCenter() is right the instant it reads it.
	const handleRegionChange = useCallback(
		(region: Region, details: Details) => {
			if (isFiniteCoordinate(region))
				centerRef.current = { latitude: region.latitude, longitude: region.longitude }
			if (interactive && onUserPan && details.isGesture === true) onUserPan()
		},
		[interactive, onUserPan]
	)

	const routeFrom = route?.from
	const routeTo = route?.to
	// No `{0,0}` fallback: Null Island is a valid coordinate, so a surface with no centre yet (the
	// rider home, which frames on the user moments later) opened on open ocean.
	const initialCenter = center ?? routeCoords?.[0] ?? fitCoords?.[0] ?? null
	// Mount framing uses `initialCamera`, in the SAME units as every later `animateCamera` below.
	//
	// It used to use `initialRegion` with a hand-rolled `360 / 2^zoom` delta, which was wrong three
	// ways at once and — because `animateCamera({ zoom })` uses the platform's real zoom level — meant
	// this one file carried two different coordinate conventions: the screen opened at one scale and
	// jumped to another the moment the first location fix or `center` change landed. The formula had
	// no viewport term (it is the span of ONE TILE, and a phone is ~1.5 tiles wide), it used the same
	// delta for latitude and longitude despite a full-bleed map being about twice as tall as it is
	// wide and Mercator latitude not matching longitude off the equator, and `react-native-maps`
	// resolves a region by FITTING it, so whichever wrong number implied the wider view won. The
	// opening frame therefore depended on the map's aspect ratio rather than the requested zoom.
	//
	// The Mapbox renderer has no equivalent split — its `defaultSettings.zoomLevel` and its
	// `setCamera({ zoomLevel })` are the same units — and that is the behaviour being matched here.
	const initialCamera = initialCenter
		? { center: initialCenter, zoom: googleZoomFor(zoom), pitch: 0, heading: 0, altitude: 0 }
		: undefined

	if (!apiKey) {
		return (
			<View testID={unavailableTestID} style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }, style]} />
		)
	}

	return (
		<View
			testID={testID}
			style={[{ flex: 1 }, style]}
			onLayout={(event) => {
				const { width, height } = event.nativeEvent.layout
				sizeRef.current = { width, height }
			}}>
			<View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
			<ErrorBoundary name={`map-google-surface`}>
				{/* Google's own logo and attribution are baked into the tiles by the SDK; they cannot be
				    hidden and must stay visible per 04 §7.3 — no chrome may cover them. */}
				<MapView
					ref={mapRef}
					testID={`map-surface`}
					provider={PROVIDER_GOOGLE}
					style={StyleSheet.absoluteFill}
					initialCamera={initialCamera}
					mapPadding={mapPadding}
					userInterfaceStyle={isDark ? 'dark' : 'light'}
					customMapStyle={isDark ? googleNightStyle : undefined}
					scrollEnabled={interactive}
					zoomEnabled={interactive}
					rotateEnabled={interactive}
					pitchEnabled={interactive}
					onPanDrag={handlePanDrag}
					onRegionChange={handleRegionChange}
					showsUserLocation={showUserLocation}
					showsMyLocationButton={false}
					onUserLocationChange={showUserLocation ? handleUserLocationChange : undefined}
					showsCompass={false}
					toolbarEnabled={false}>
					{routeCoords ? (
						<ErrorBoundary>
							<Polyline
								coordinates={routeCoords}
								strokeColor={colors.white}
								strokeWidth={ROUTE_CASING_WIDTH}
								lineCap={`round`}
								lineJoin={`round`}
								zIndex={1}
							/>
							<Polyline
								coordinates={routeCoords}
								strokeColor={route?.color ?? colors.primary}
								strokeWidth={route?.width ?? ROUTE_WIDTH}
								lineCap={`round`}
								lineJoin={`round`}
								zIndex={2}
							/>
						</ErrorBoundary>
					) : null}

					{routeFrom && routeTo && (route?.showMarkers ?? true) ? (
						<ErrorBoundary>
							<DotMarker
								id={`map-route-from`}
								coordinate={routeFrom}
								fill={route?.startMarkerColor ?? `success`}
								size={18}
							/>
							<DotMarker
								id={`map-route-to`}
								coordinate={routeTo}
								fill={route?.endMarkerColor ?? `error`}
								size={18}
							/>
						</ErrorBoundary>
					) : null}

					{markers?.map((marker) => {
						if (!isFiniteCoordinate(marker.coordinate)) return null
						if (marker.variant === 'driver') {
							return (
								<DriverMarker
									key={`map-marker-${marker.id}`}
									marker={marker}
									shadowStyle={componentStyles.driverMarker}
								/>
							)
						}
						const fill = marker.color ?? MARKER_TOKEN_BY_VARIANT[marker.variant ?? 'point']
						return (
							<DotMarker
								key={`map-marker-${marker.id}`}
								id={`map-marker-${marker.id}`}
								coordinate={marker.coordinate}
								fill={fill}
							/>
						)
					})}
				</MapView>
			</ErrorBoundary>

			{/* Not gated on `showUserLocation` any more: a screen following a DRIVER puck has no user dot
			    and still needs a way back to its subject. */}
			{showRecenter ? (
				<Pressable
					testID={recenterTestID}
					accessibilityLabel={`Recenter the map`}
					onPress={handleRecenter}
					style={[componentStyles.recenter, recenterStyle]}>
					<Icon family={`MaterialCommunityIcons`} name={`crosshairs-gps`} size={24} color={`primary`} />
				</Pressable>
			) : null}
		</View>
	)
})

Component.displayName = 'MapGoogle'
