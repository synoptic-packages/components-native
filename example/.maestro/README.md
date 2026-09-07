# Example app Maestro suite

On-device sweep for two gallery stories that together render one marker per
component family, including the 8 components harvested from ventry mobile
(`Link`, `ExternalLink`, `StatusError`/`StatusSuccess`, `Splash`,
`AvatarUser`/`AvatarContact`, `Browser`, `QrScanner`, `CameraPreview`).
No screenshots are kept — pass/fail plus maestro output is the record.

## Run

1. Build + install the dev client once: `npx expo run:ios` (from `example/`).
   Rebuild after adding native deps (`expo-camera`, `react-native-webview`).
2. `bash .maestro/run.sh`

`run.sh` rebuilds the library, packs it, installs the tarball into the
example app (mirroring the release candidate exactly — no Metro aliases, no
source mounts), then sweeps in two phases: Metro pinned at
`qa-gallery--default` for flows 01–09, restarted pinned at
`qa-gallery2--default` for flows 10–12. Each flow relaunches the app cold
(`stopApp: true`, scroll position resets) with up to 3 attempts.

## Layout

- `flows/01-controls.yaml` … `flows/09-money.yaml` — `QA/Gallery` sections.
- `flows/10-navigation.yaml` … `flows/12-camera.yaml` — `QA/Gallery2`
  sections. Only `01`/`10` assert their story's top marker; the rest chain
  short scroll hops (each leg a nearby anchor) with an `assertVisible`
  immediately after its hop, while the target is still in the viewport.

## Scroll-notes (hard-won, sim iPhone 16)

- iOS hides off-screen elements from the accessibility tree, so every
  below-fold marker needs a scroll hop first.
- The story root is our own `ScrollView` (the Storybook preview does not
  scroll). Fast 400ms swipes do not move it — hops use slow
  `scrollUntilVisible` (`speed: 5`).
- Maestro's in-hop visibility polls go stale on long stories: the viewport
  demonstrably reaches an anchor while the gate still times out. Hops
  therefore carry `optional: true` (movement only); the following
  `assertVisible`/`extendedWaitUntil` use fresh snapshots and do the real
  verification. A genuinely missing marker still fails its assert.
- Text matching is exact: assert the full marker string (e.g. the money
  label is `Gallery money v2`, not `Gallery money`).
- One story grew too long for reliable hops (tail anchors unreachable even
  chained), so the sweep split into `QA/Gallery` + `QA/Gallery2`. Keep each
  story short enough that every marker is a few hops away.
- `CameraGeneral`/`CameraSelfie` are NOT in either story: mounting a live
  expo `CameraView` in the sim poisons `ScrollView` measurement (bisected —
  siblings stop laying out, swipes stop moving). They are thin prop
  pass-throughs to expo-camera, covered by typecheck + export audit +
  production use in ventry. `QrScanner` (permission/live states) and
  `CameraPreview` (null/uploading states) sweep in flow 12.
- Flow 12 asserts the permission-GRANTED scanner state (`Point the camera
  at a QR code` hint over the live view); a fresh sim without granted
  camera permission shows the permission prompt instead.
- `Link`/`ExternalLink` are router-agnostic by design (pressable + `href`
  data + `onPress`; no expo-router provider needed). Do NOT add an
  `accessibilityLabel` fallback to `href` — the collapsed accessibility node
  would hide the visible label text.
