# @synotech/components-native example

A minimal Expo app that imports `@synotech/components-native` (via `file:..`) and
renders a few components — the fastest way to run the library locally.

## Run

```bash
cd example
yarn install
yarn ios      # or: yarn android / yarn start
```

Requires the usual Expo dev environment (Xcode for iOS, Android Studio for
Android, or the Expo Go app via `yarn start`).

## What it shows

- `Button` (primary/secondary/error, contained/outlined)
- `Text` (theme-aware variants + colors)
- `Card` and `View` (theme tokens)
- `setBrandColors({ primary, accent })` brand injection
- `PaperProvider` + `SafeAreaProvider` wiring
