// @synotech/components-native — shared React Native component library.
//
// Lifted from the Synoptic mobile apps (synoptic-{krugergold,ventry,vya}/mobile)
// so future projects can install the RN design system as a package.

// Theme + design tokens
export * from './theme'

// Shared types
export * from './types'

// Hooks
export * from './hooks/useTheme'
export * from './hooks/useForms'
// useCountry/useCurrency ship their own dataset-backed Country/Currency
// shapes that collide with the backend-DTO types in ./types, so they are
// re-exported under aliased names instead of export *.
export { useCountry, type UseCountryReturn, type Country as CountryOption } from './hooks/useCountry'
export { useCurrency, type UseCurrencyReturn, type Currency as CurrencyOption } from './hooks/useCurrency'

// Constants (sizing/input/z-index tokens + datasets)
export * from './constants'

// Vendored helpers
export * from './lib'

// Components
export * from './components'
