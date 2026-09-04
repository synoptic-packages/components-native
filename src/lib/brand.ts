/**
 * Brand colour registry.
 *
 * The mobile app reads its brand colours from `app.config` (via `expo-constants`). This package must
 * stay config-free, so colours are registered at runtime by the host app through `setBrandColors()`
 * and read through `getBrandColors()`, which always returns defaults until registered. `useTheme()`
 * merges them over the base palette so every component that resolves `primary`/`accent` picks up the
 * brand automatically.
 */

export interface BrandColors {
	primary: string
	accent: string
}

const DEFAULT_BRAND_COLORS: BrandColors = {
	// The shared default primary; matches the mobile theme's own fallback palette so a host that never
	// registers brand colours still renders legibly.
	primary: '#2a42de',
	accent: '#01FFFF',
}

let brandColors: BrandColors = { ...DEFAULT_BRAND_COLORS }

/** Override the brand colours used by `useTheme` and every themed component. */
export const setBrandColors = (next: Partial<BrandColors> | undefined | null): void => {
	brandColors = {
		...DEFAULT_BRAND_COLORS,
		...(next ?? {}),
	}
}

/** The currently registered brand colours (defaults when unregistered). */
export const getBrandColors = (): BrandColors => ({ ...brandColors })
