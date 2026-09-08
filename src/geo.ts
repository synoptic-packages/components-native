// @synotech/components-native/geo — OPT-IN geo surfaces (places, routes, maps).
//
// Import path: `import { FieldPlaces } from '@synotech/components-native/geo'`
//
// These are deliberately NOT part of the root barrel. Rationale:
// - They read `@wallet/provider` geo hooks at module scope
//   (`useGeoAutocomplete`, polyline/format helpers). Hosts without the
//   provider peer (ventry, krugergold) would fail Metro resolution.
// - `Map` additionally needs heavy native modules (`@rnmapbox/maps`,
//   `react-native-maps`, `expo-location`).
//
// Contents:
// - `FieldPlaces` (+ `FieldPlacesProps`) — geo autocomplete field.
// - `FieldRoute` (+ `FieldRouteProps`, `FieldRouteValue`, `FieldRoutePlace`)
//   — origin/destination/stops composer built on `FieldPlaces`.
// - `Map`, `FocusAwareMap`, `MapGoogle`, `MapMapbox`, `MapWebview`, the
//   renderer store (`configureMap`, `mapRendererServerSet`, …) and all map
//   types — see `src/map.ts`, re-exported here for the single-geo-import case.
export { FieldPlaces } from './components/field-places'
export type { FieldPlacesProps } from './components/field-places'
export { FieldRoute } from './components/field-route'
export type { FieldRouteProps, FieldRouteValue, FieldRoutePlace } from './components/field-route/src/types'
export * from './map'
