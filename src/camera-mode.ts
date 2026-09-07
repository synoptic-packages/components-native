// @synotech/components-native/camera-mode — OPT-IN camera capture UI.
//
// Import path: `import { CameraGeneral } from '@synotech/components-native/camera-mode'`
//
// These components are deliberately NOT part of the root barrel. Rationale:
// - They mount a live expo `CameraView` (native camera session). That is a
//   heavyweight, permission-gated native surface — not something to pull into
//   every app bundle by default, and not something that can run headless in a
//   simulator sweep (mounting it poisons ScrollView measurement; verified by
//   bisect during the gallery work).
// - Hosts that need document/selfie capture opt in explicitly and take the
//   `expo-camera` peer with it.
//
// Contents:
// - `CameraGeneral` — full-screen document/object capture (torch, flip, capture).
// - `CameraSelfie` — guided selfie capture with face mask + brand watermark slot.
// - `CameraPreview` — accept/retry review step after a capture (no camera session;
//   also safe to render wherever a preview step is needed).
//
// For QR scanning (no capture session, sim-safe), use the root `QrScanner`.
export * from './components/camera-mode'
