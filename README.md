# @synotech/components-native

Shared React Native component library for the Synotech ecosystem.

Lifted from the Synoptic mobile apps (`synoptic-{krugergold,ventry,vya}/mobile`)
so future projects can install the RN design system as a package instead of
copying it.

## Install

```bash
yarn add @synotech/components-native react-native-paper react-native-svg \
  react-hook-form @gorhom/bottom-sheet react-native-reanimated \
  react-native-gesture-handler react-native-safe-area-context
```

Requires the peer deps listed in `package.json` (Expo/RN stack).

## Usage

```tsx
import { Button, Text, View, Card, useTheme, setBrandColors } from '@synotech/components-native'

setBrandColors({ brand_color: '#C2410C', brand_color_accent: '#FDBA74' })

export const Screen = () => {
  const theme = useTheme()
  return (
    <View>
      <Button variant="primary">Pay</Button>
      <Text color="text">Hello</Text>
    </View>
  )
}
```

## Included

- 50+ components: button, text, Card, view, icon (multi-family: Synotech,
  Lucide, vector icons), the `field-*` family (~20 RHF-bound fields), bottomsheet,
  dialog, modal (incl. amount-pad), snackbar, toast, list, money, form, etc.
- Theme: `ThemeColors` semantic tokens + `setBrandColors` brand injection,
  Paper font config, `useTheme` + ColorName/StyleObject resolution
- Vendored helpers (previously from `@wallet/provider` / the app)

## Opt-in subpaths (not in the root barrel)

Camera capture UI mounts a live expo `CameraView` (native session,
permission-gated) — too heavy to bundle by default, so it lives behind a
documented subpath. QR scanning stays in the root barrel (no session).

```tsx
import { CameraGeneral, CameraSelfie, CameraPreview } from '@synotech/components-native/camera-mode'
```

- `CameraGeneral` — full-screen document/object capture (torch, flip, capture).
- `CameraSelfie` — guided selfie capture with face mask + brand watermark slot.
- `CameraPreview` — accept/retry review step after a capture.
- Requires the `expo-camera` peer. `CameraGeneral`/`CameraSelfie` cannot run
  headless in a simulator (they are excluded from the on-device sweep for
  that reason); `QrScanner` + `CameraPreview` sweep in Maestro flow 12.

## Build

```bash
yarn install
yarn typecheck
yarn build   # dist/ with commonjs + esm + dts
```
