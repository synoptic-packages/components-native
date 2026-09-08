import { ErrorBoundary } from '../../error-boundary'
import { Icon } from '../../icon'
import { Pressable } from '../../pressable'
import { View } from '../../view'
import { mapBuildConfigGet } from './rendererStore'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import { resolveColor } from '../../../lib/color'
import { decodePolyline5, mapBoundsOf, mapEdgePaddingClamp, mapEdgePaddingResolve } from '@wallet/provider'
import Mapbox, {
	Camera,
	CircleLayer,
	LineLayer,
	LocationPuck,
	MapView,
	PointAnnotation,
	ShapeSource,
	UserLocation,
} from '@rnmapbox/maps'
import type { Feature, LineString } from 'geojson'
import React, {
	type ComponentRef,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react'
import { StyleSheet } from 'react-native'
import { styles } from './styles'
import type { MapCoordinate, MapEdgePadding, MapHandle, MapMarker, MapProps } from './types'

const DEFAULT_ZOOM = 14
const ROUTE_WIDTH = 4
const ROUTE_CASING_WIDTH = ROUTE_WIDTH + 4
const ROUTE_ANIMATION_WIDTH = ROUTE_WIDTH - 1
const ROUTE_ANIMATION_CYCLE_MS = 60000 / 36

const MARKER_TOKEN_BY_VARIANT: Record<NonNullable<MapMarker['variant']>, ColorName> = {
	origin: 'success',
	destination: 'error',
	driver: 'primary',
	rider: 'accent',
	queue: 'warning',
	point: 'info',
}

const resolveToken = (): string => {
	const runtime = mapBuildConfigGet().mapboxAccessToken
	if (typeof runtime === 'string' && runtime.trim()) return runtime
	return process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
}

const toLngLat = (coordinate: MapCoordinate): [number, number] => [coordinate.longitude, coordinate.latitude]
const fromLngLat = ([longitude, latitude]: [number, number]): MapCoordinate => ({ latitude, longitude })

const isFiniteCoordinate = (coordinate: MapCoordinate): boolean =>
	Number.isFinite(coordinate.latitude) && Number.isFinite(coordinate.longitude)

// Padding normalisation, the axis clamp and the bounds computation live in `@wallet/provider`
// (`mapRendererGeometry`), shared with the Google renderer and unit-tested there.
//
// The clamp in particular MUST stay shared. It was 60% here, a frame screen exposed that as too
// tight — an `even` sheet covers 51% and the floating chrome asks for ~96pt more, so the real request
// exceeded the cap, the fit was proportionally squashed, and the route's endpoints, with the driver
// puck on one of them, landed under the sheet where nobody could see them — and the fix to 80% was
// applied HERE and not to the copy in the Google renderer, which carried the defect forward for any
// tenant switched to it. Do not re-inline it.
const toEdgePaddingTuple = (padding: MapEdgePadding | undefined): [number, number, number, number] => {
	const insets = mapEdgePaddingResolve(padding)
	return [insets.top, insets.right, insets.bottom, insets.left]
}

const clampEdgePadding = (
	padding: [number, number, number, number],
	size: { width: number; height: number }
): [number, number, number, number] => {
	const [top, right, bottom, left] = padding
	const clamped = mapEdgePaddingClamp({ top, right, bottom, left }, size)
	return [clamped.top, clamped.right, clamped.bottom, clamped.left]
}

const computeBounds = (points: MapCoordinate[]) => {
	const bounds = mapBoundsOf(points)
	if (!bounds) return null
	return {
		ne: [bounds.northEast.longitude, bounds.northEast.latitude] as [number, number],
		sw: [bounds.southWest.longitude, bounds.southWest.latitude] as [number, number],
	}
}

const animationGradient = (progress: number, transparent: string, highlight: string): unknown[] => [
	'step',
	['line-progress'],
	transparent,
	progress,
	highlight,
]

// Stated degradations, per parity spec 019 §10 §3.4 ("a divergence is either fixed or written into
// the header comment as a stated degradation"). Both are Mapbox-only — the Google renderer is
// unaffected — so they belong here rather than in the Google file's own degradation list:
// (i) at `trace` dominance (~95% sheet coverage) the true required camera clearance exceeds what
// `MAP_EDGE_PADDING_AXIS_LIMIT` (0.8, in `provider/`) can satisfy, and the clamp is not edge-selective
// — when it collapses, BOTH edges collapse together: the destination endpoint still hides behind the
// top chrome pill and the origin still renders behind the bottom sheet, even with correctly-applied
// padding (finding 0190, round 2 correction; top edge confirmed holding at `minor` dominance and on
// Google, open/blocked on Mapbox at `trace`);
// (ii) a `setCamera` call whose padding changes but whose coordinate does not is a visual no-op on
// this SDK — the followed-user padding-only re-issue effect below fires correctly and produces no pan
// (finding 0191 residual, open).
export const Component = forwardRef<MapHandle, MapProps>(function MapMapbox(
	{
		center,
		zoom = DEFAULT_ZOOM,
		showUserLocation = false,
		followUserLocation = false,
		pulseUserLocation = false,
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
	// The DECLARATIVE camera padding is clamped by the same shared rule as the imperative one.
	//
	// It was not, and that is why a fitted route or a pair of pins was never actually framed. A frame
	// asks for `bottom = sheetHeight * coverFactor + bleed` plus a top chrome clearance, and on a tall
	// sheet that is nearly the whole viewport: measured on device on the confirm screen, top 130 and
	// bottom 741 on an 874pt map — opposing insets consuming 99.7% of the axis and leaving the camera a
	// THREE POINT window to fit into. `fitBounds` then has nothing to work with, so it appears to do
	// nothing at all: correct bounds, live camera ref, no movement.
	//
	// `mapEdgePaddingClamp` is the existing shared guard for exactly this (80% per axis, its own
	// docstring explains why 80 and not 60), already applied to the imperative `fitBounds` padding on
	// both renderers. Applying it here too means the two paths agree about how much of the map the
	// sheet may claim, which is what they always should have done.
	const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
	const cameraPaddingTuple = useMemo(() => {
		if (cameraPadding === undefined) return null
		const clamped = mapEdgePaddingClamp(mapEdgePaddingResolve(cameraPadding), mapSize)
		return {
			paddingTop: clamped.top,
			paddingRight: clamped.right,
			paddingBottom: clamped.bottom,
			paddingLeft: clamped.left,
		}
	}, [cameraPadding, mapSize])

	// `handle` (below) is memoized with an EMPTY dependency array on purpose — its identity must stay
	// stable because `fitBounds`'s own effects key on it. A closure inside it that read
	// `cameraPaddingTuple` directly would therefore see only whatever padding was active at first
	// mount, forever. `cameraPaddingRef` is kept current on every render, the same pattern
	// `fitPaddingRef`/`fitCoordsRef` already use below for the same reason. `handle.flyTo` (finding
	// 0191) reads through it rather than through the closed-over value.
	const cameraPaddingRef = useRef<typeof cameraPaddingTuple>(null)
	cameraPaddingRef.current = cameraPaddingTuple

	// `cameraPadding` is a fresh object every render from most callers (it is derived from sheet
	// state, not memoized), so `cameraPaddingTuple` above is too — a caller keying an effect on
	// object identity would re-fire every render. This is the same problem `fitPaddingKey` already
	// solves for the route-fit effect below; the follow-mode effect (finding 0191) needs its own
	// copy because it keys on cameraPadding rather than route.fitPadding.
	const followPaddingKey = useMemo(() => {
		if (!cameraPaddingTuple) return 'none'
		const { paddingTop, paddingRight, paddingBottom, paddingLeft } = cameraPaddingTuple
		return `${paddingTop},${paddingRight},${paddingBottom},${paddingLeft}`
	}, [cameraPaddingTuple])
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const cameraRef = useRef<ComponentRef<typeof Camera> | null>(null)
	const userCoordRef = useRef<MapCoordinate | null>(null)
	const centerRef = useRef<MapCoordinate | null>(center ?? null)
	const hasFramedUserRef = useRef(false)
	const [animGradient, setAnimGradient] = useState<unknown[]>(() =>
		animationGradient(0, colors.transparent, colors.white)
	)
	const animFrameRef = useRef<number | null>(null)
	const animStartedAtRef = useRef<number | null>(null)
	const token = useMemo(resolveToken, [])

	useEffect(() => {
		if (token) Mapbox.setAccessToken(token)
	}, [token])

	// Measured by onLayout so fitBounds can clamp padding to the real viewport rather than assuming a
	// full-screen map. Zero until first layout, which clampEdgePadding treats as "no clamping possible".
	const sizeRef = useRef({ width: 0, height: 0 })

	const handle = useMemo<MapHandle>(
		() => ({
			// Finding 0191: `flyTo(coordinate, duration)` has no padding parameter at all, so the
			// frame's fly-user command (and, before this fix, `handleRecenter` below) anchored the
			// coordinate at the RAW viewport centre — dropping the puck out of its padded position
			// until the next GPS fix re-applied `handleUserLocationUpdate`'s own padding. `setCamera`
			// carries the CURRENT padding explicitly, read through `cameraPaddingRef` since this
			// closure is created once (see the ref's own comment above).
			flyTo: (coord, durationMs = 600) => {
				cameraRef.current?.setCamera({
					centerCoordinate: toLngLat(coord),
					padding: cameraPaddingRef.current ?? undefined,
					animationDuration: durationMs,
				})
			},
			fitBounds: (coords, padding) => {
				if (coords.length < 2) return
				const bounds = computeBounds(coords)
				if (!bounds) return
				const clamped = clampEdgePadding(toEdgePaddingTuple(padding), sizeRef.current)
				cameraRef.current?.fitBounds(bounds.ne, bounds.sw, clamped, 600)
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

	useEffect(() => {
		if (!route?.animate) return
		const tick = (time: number) => {
			animStartedAtRef.current ??= time
			const progress = ((time - animStartedAtRef.current) % ROUTE_ANIMATION_CYCLE_MS) / ROUTE_ANIMATION_CYCLE_MS
			setAnimGradient(animationGradient(progress, colors.transparent, colors.white))
			animFrameRef.current = requestAnimationFrame(tick)
		}
		animFrameRef.current = requestAnimationFrame(tick)
		return () => {
			if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
			animStartedAtRef.current = null
		}
	}, [route?.animate, colors.transparent, colors.white])

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
	// default is still the right one. Shared verbatim with the Google renderer; keep the two in step.
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

	const markerCoords = useMemo<MapCoordinate[] | null>(() => {
		const points = (markers ?? []).map((marker) => marker.coordinate).filter(isFiniteCoordinate)
		return points.length > 1 ? points : null
	}, [markers])

	// No route, but markers: frame the markers, ONCE.
	//
	// A route snapshot priced as `DEGRADED_ESTIMATE` carries a distance and a duration but no
	// polyline, so `route` is never passed, `fitCoords` is null, and `initialCenter` — which also
	// derives from the route — is null too. The camera then keeps the style's default world view. The
	// rider's assigned screen opened on a map of the planet with one puck over Johannesburg while the
	// sheet under it correctly read "5.2 km · 11 min". Nothing errored; the map did exactly what it
	// was told, having been told nothing.
	//
	// ONCE is the whole subtlety. The driver puck is a marker and it moves on every LiveQuery tick, so
	// a fit that re-ran on marker changes would drag the camera back every few seconds and fight any
	// pan the rider made. This frames the first time real coordinates exist and then hands the camera
	// over — the frame's own pan-to-break / tap-to-recenter contract owns it from there.
	const hasFramedMarkersRef = useRef(false)
	useEffect(() => {
		if (fitCoords || hasFramedMarkersRef.current || !markerCoords) return
		hasFramedMarkersRef.current = true
		const timer = setTimeout(() => {
			handle.fitBounds(markerCoords, route?.fitPadding ?? fitPaddingDefault)
		}, 300)
		return () => clearTimeout(timer)
	}, [handle, fitCoords, markerCoords, route?.fitPadding, fitPaddingDefault])

	const routeFeature = useMemo<Feature<LineString> | null>(() => {
		if (!routeCoords || routeCoords.length < 2) return null
		return {
			type: 'Feature',
			properties: {},
			geometry: { type: 'LineString', coordinates: routeCoords.map(toLngLat) },
		}
	}, [routeCoords])

	// Product markers draw as ShapeSource + CircleLayers, NOT as annotation views. On this
	// new-architecture build (@rnmapbox/maps 10.3.0 + Fabric) a MarkerView's children never draw, and
	// a PointAnnotation renders only when it exists at map mount — markers that arrive async (a job
	// projection, a live driver point) mounted into the React tree while the map showed nothing.
	// Layers update reliably (the route line is the proof), so markers are features. The driver puck
	// is the larger pair; its live position keeps `map-marker-driver`-style ids OUT of the native view
	// tree, which is why flows assert the sheet's live indicator instead of a marker id.
	const markerCollection = useMemo(() => {
		const features = (markers ?? [])
			.filter((marker) => isFiniteCoordinate(marker.coordinate))
			.map((marker) => {
				const token = MARKER_TOKEN_BY_VARIANT[marker.variant ?? 'point']
				const fill = resolveColor(marker.color ?? token, colors)
				const isDriver = marker.variant === 'driver'
				return {
					type: 'Feature' as const,
					id: `map-marker-${marker.id}`,
					properties: { fill, halo: isDriver ? 16 : 10, core: isDriver ? 11 : 7 },
					geometry: { type: 'Point' as const, coordinates: toLngLat(marker.coordinate) },
				}
			})
		return features.length ? { type: 'FeatureCollection' as const, features } : null
	}, [markers, colors])

	const handleUserLocationUpdate = useCallback(
		(loc: { coords: { latitude: number; longitude: number } }) => {
			const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
			if (!isFiniteCoordinate(coord)) return
			userCoordRef.current = coord
			onUserLocationChange?.(coord)
			if (followUserLocation) {
				// The FIRST fix states the zoom, every later one only pans. Later updates deliberately
				// leave zoom alone: it belongs to the rider once they have pinched it.
				//
				// Finding 0191: `flyTo(coordinate, duration)` has no padding parameter at all, and an
				// un-padded `setCamera` anchors the coordinate at the RAW viewport centre rather than the
				// declarative `<Camera padding>`'s padded one — so a followed puck froze at the un-padded
				// centre on first fix and never moved again even once the sheet (and `cameraPadding`)
				// changed under it. Both branches now carry the CURRENT padding explicitly; the effect
				// below carries the companion case (padding changes with no new fix to trigger this
				// handler at all).
				if (hasFramedUserRef.current) {
					cameraRef.current?.setCamera({
						centerCoordinate: toLngLat(coord),
						padding: cameraPaddingTuple ?? undefined,
						animationDuration: 600,
					})
				} else {
					hasFramedUserRef.current = true
					cameraRef.current?.setCamera({
						centerCoordinate: toLngLat(coord),
						zoomLevel: zoom,
						padding: cameraPaddingTuple ?? undefined,
						animationDuration: 600,
					})
				}
			}
		},
		[followUserLocation, onUserLocationChange, zoom, cameraPaddingTuple]
	)

	// Finding 0191, companion half: a sheet drag/resize changes `cameraPadding` with no new GPS fix
	// to carry it through `handleUserLocationUpdate` above — measured on device, the followed puck
	// simply stayed at its last screen position and vanished under a growing sheet. Re-issuing the
	// camera move against the LAST KNOWN coordinate whenever the effective padding actually changes
	// (keyed on `followPaddingKey`, not object identity — see its own comment) is the correct intent
	// and IS what runs; the finding's own device measurement of this exact effect found the native
	// camera does not visually reflect a padding-only update when the coordinate does not also
	// change (a same-coordinate `setCamera` call, even with a materially different padding, produced
	// no pan) — an `@rnmapbox/maps` constraint, not a bug in this effect, and not solved by nudging
	// the coordinate (tried on-device: negligible nudges changed nothing, a large one produced a
	// world-view camera fault and was reverted, not shipped) or by `animationMode: 'moveTo'` (tried
	// on-device in a fix round: routes the call to a direct native camera set instead of the Ease
	// animator, on the theory Ease was short-circuiting a same-coordinate update — a controlled A/B
	// screenshot diff of the map tile band, same coordinate, same padding, `moveTo` vs the default,
	// came back pixel-identical; reverted, not shipped). Left calling the semantically correct API
	// rather than a hack; see the finding for the open half.
	useEffect(() => {
		if (!followUserLocation || !hasFramedUserRef.current) return
		const coord = userCoordRef.current
		if (!coord) return
		cameraRef.current?.setCamera({
			centerCoordinate: toLngLat(coord),
			padding: cameraPaddingTuple ?? undefined,
			animationDuration: 300,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [followUserLocation, followPaddingKey])

	const handleRecenter = useCallback(() => {
		if (recenterFliesToUser) {
			const coord = userCoordRef.current
			// Finding 0191: `flyTo` cannot carry padding, so a recenter tap used to undo the padded
			// framing `handleUserLocationUpdate` establishes and drop the puck back to the raw centre.
			// `setCamera` with the current padding matches that framing symmetrically.
			if (coord) {
				cameraRef.current?.setCamera({
					centerCoordinate: toLngLat(coord),
					padding: cameraPaddingRef.current ?? undefined,
					animationDuration: 600,
				})
			}
		}
		onRecenter?.()
	}, [onRecenter, recenterFliesToUser])

	const routeFrom = route?.from
	const routeTo = route?.to
	// No `{0,0}` fallback. Null Island is a VALID coordinate, so the camera mounted there and showed
	// open ocean — indistinguishable from a broken map — whenever a surface had no centre yet (the
	// rider home, which frames on the user's own location moments later). Without a real coordinate
	// the camera simply keeps the style's own view until the first fix arrives.
	const initialCenter = center ?? routeCoords?.[0] ?? fitCoords?.[0] ?? null

	if (!token) {
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
				// State as well as the ref: the declarative padding clamp above is a memo and cannot read
				// a ref. Guarded so a re-layout at the same size does not re-render.
				setMapSize((current) =>
					current.width === width && current.height === height ? current : { width, height }
				)
			}}>
			<View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
			<ErrorBoundary name={`map-mapbox-surface`}>
				<MapView
					testID={`map-surface`}
					style={StyleSheet.absoluteFill}
					styleURL={isDark ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Light}
					scrollEnabled={interactive}
					zoomEnabled={interactive}
					rotateEnabled={interactive}
					pitchEnabled={interactive}
					// `centerRef` tracks EVERY change, programmatic moves included — a fixed-pin picker reading
					// `getCenter()` on confirm wants wherever the camera actually is, not just where a gesture
					// left it. `onUserPan` stays gesture-gated for its existing reason: `onCameraChanged` also
					// fires for programmatic moves, so an ungated signal would make every `fitBounds`
					// immediately break its own camera to free.
					onCameraChanged={(state) => {
						if (
							isFiniteCoordinate({
								latitude: state.properties.center[1],
								longitude: state.properties.center[0],
							})
						) {
							centerRef.current = fromLngLat(state.properties.center as [number, number])
						}
						if (state.gestures?.isGestureActive) onUserPan?.()
					}}
					compassEnabled={false}
					scaleBarEnabled={false}
					// Both were `false`, which is a licence violation, not a style choice: provider
					// attribution and logo must stay visible (04 §7.3). Do not hide them again to make a
					// full-bleed map look cleaner — the inset card on `full` dominance leaves room for them.
					logoEnabled
					attributionEnabled>
					<ErrorBoundary>
						<Camera
							ref={cameraRef}
							defaultSettings={
								initialCenter
									? { centerCoordinate: toLngLat(initialCenter), zoomLevel: zoom }
									: undefined
							}
							centerCoordinate={center ? toLngLat(center) : undefined}
							zoomLevel={center ? zoom : undefined}
							padding={cameraPaddingTuple ?? undefined}
							animationMode={`flyTo`}
							animationDuration={600}
						/>
					</ErrorBoundary>

					{routeFeature ? (
						<ErrorBoundary>
							<ShapeSource id={`map-route`} shape={routeFeature} lineMetrics>
								<LineLayer
									id={`map-route-casing`}
									style={{
										lineColor: colors.white,
										lineWidth: ROUTE_CASING_WIDTH,
										lineCap: 'round',
										lineJoin: 'round',
									}}
								/>
								<LineLayer
									id={`map-route-line`}
									aboveLayerID={`map-route-casing`}
									style={{
										lineColor: route?.color ?? colors.primary,
										lineWidth: route?.width ?? ROUTE_WIDTH,
										lineCap: 'round',
										lineJoin: 'round',
									}}
								/>
								<React.Fragment>
									{route?.animate && (
										<LineLayer
											id={`map-route-anim`}
											aboveLayerID={`map-route-line`}
											style={{
												lineGradient: animGradient as never,
												lineWidth: ROUTE_ANIMATION_WIDTH,
												lineCap: 'round',
												lineJoin: 'round',
												lineOpacity: 0.9,
											}}
										/>
									)}
								</React.Fragment>
							</ShapeSource>
						</ErrorBoundary>
					) : null}

					{routeFrom && routeTo && (route?.showMarkers ?? true) ? (
						<ErrorBoundary>
							<PointAnnotation id={`map-route-from`} coordinate={toLngLat(routeFrom)}>
								<View
									width={18}
									height={18}
									borderRadius={9}
									backgroundColor={route?.startMarkerColor ?? `success`}
									borderWidth={3}
									borderColor={`white`}
								/>
							</PointAnnotation>
							<PointAnnotation id={`map-route-to`} coordinate={toLngLat(routeTo)}>
								<View
									width={18}
									height={18}
									borderRadius={9}
									backgroundColor={route?.endMarkerColor ?? `error`}
									borderWidth={3}
									borderColor={`white`}
								/>
							</PointAnnotation>
						</ErrorBoundary>
					) : null}

					{markerCollection ? (
						<ShapeSource id={`map-markers`} shape={markerCollection}>
							<CircleLayer
								id={`map-markers-halo`}
								style={{
									circleRadius: ['get', 'halo'],
									circleColor: colors.white,
									circlePitchAlignment: 'map',
								}}
							/>
							<CircleLayer
								id={`map-markers-core`}
								style={{
									circleRadius: ['get', 'core'],
									circleColor: ['get', 'fill'],
									circlePitchAlignment: 'map',
								}}
							/>
						</ShapeSource>
					) : null}

					{showUserLocation ? (
						<>
							<UserLocation visible animated onUpdate={handleUserLocationUpdate}>
								<CircleLayer
									id={`map-user-white`}
									key={`map-user-white`}
									style={{ circleRadius: 9, circleColor: colors.white, circlePitchAlignment: 'map' }}
								/>
								<CircleLayer
									id={`map-user-dot`}
									key={`map-user-dot`}
									aboveLayerID={`map-user-white`}
									style={{
										circleRadius: 6,
										circleColor: colors.primary,
										circlePitchAlignment: 'map',
									}}
								/>
							</UserLocation>
							{pulseUserLocation ? (
								<LocationPuck pulsing={{ isEnabled: true, color: colors.primary, radius: 60 }} />
							) : null}
						</>
					) : null}
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

Component.displayName = 'MapMapbox'
