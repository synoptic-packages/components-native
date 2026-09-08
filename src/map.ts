// @synotech/components-native/map — OPT-IN map surfaces.
//
// Import path: `import { Map } from '@synotech/components-native/map'`
//
// Maps are deliberately NOT part of the root barrel. Rationale:
// - The renderers need heavy native modules (`@rnmapbox/maps`,
//   `react-native-maps`, `expo-location`) that most hosts never install —
//   bundling them by default would break every host without those peers.
// - Renderer + credentials are host-owned: call `configureMap()` once at
//   startup with the build-time tokens, and keep calling
//   `mapRendererServerSet()` from the compartment bootstrap exactly as
//   before (server-driven renderer switching is unchanged).
//
// Contents: `Map`, `FocusAwareMap`, `MapGoogle`, `MapMapbox`, `MapWebview`,
// the renderer store (`mapRendererBaked/BuildSupports/ServerGet/ServerSet/
// Subscribe/Reset`, `configureMap`, `MAP_RECENTER_CONTROL_SIZE`) and all
// map types. For QR scanning (no native map SDKs), use the root `QrScanner`.
export * from './components/map'
