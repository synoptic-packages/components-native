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

## Build

```bash
yarn install
yarn typecheck
yarn build   # dist/ with commonjs + esm + dts
```
