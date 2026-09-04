/**
 * Optical tracking for the DISPLAY face.
 *
 * A typeface is drawn with one set of sidebearings, and those sidebearings are a compromise struck at
 * a reading size. Set the same face at 48pt and the gaps between letters scale up with everything
 * else, so the word stops reading as a word and starts reading as a row of letters. Every serious
 * type system corrects for this — Apple's SF ships per-size tracking tables, Inter ships a dynamic
 * metric — and the correction is always negative and always grows with size.
 *
 * `letterSpacing` in React Native is absolute (density-independent px), not `em`, so a fixed number
 * cannot follow the size it is set at: -0.5 is invisible at 48pt and mangles 12pt. That is why this
 * is a FUNCTION OF SIZE rather than a constant, and why nothing may hardcode a tracking value.
 *
 * The ratio steps rather than staying flat, because the defect it corrects is not linear. A flat
 * -0.02em leaves a 48pt headline still loose while already pinching a 14pt title. The bands below are
 * the conventional shape: barely there at reading sizes, decisive at display sizes.
 *
 * | size    | ratio   | example                        |
 * | ------- | ------- | ------------------------------ |
 * | ≥ 44    | -0.030  | displayLarge 48 → -1.44        |
 * | 32–43   | -0.025  | displaySmall 32 → -0.80        |
 * | 24–31   | -0.020  | headlineSmall 24 → -0.48       |
 * | 18–23   | -0.015  | titleLarge 22 → -0.33          |
 * | < 18    | -0.010  | titleMedium 16 → -0.16         |
 *
 * Scope is the display face only. `Font-Wide` is deliberately excluded: it is a WIDE cut chosen where
 * openness is the point (section-carousel titles), and tightening it would work against the reason it
 * was picked. `Font-Label` and the body faces are set at reading sizes where their own sidebearings
 * are already correct.
 */
const TRACKING_RATIO_BANDS: readonly { minSize: number; ratio: number }[] = [
	{ minSize: 44, ratio: -0.03 },
	{ minSize: 32, ratio: -0.025 },
	{ minSize: 24, ratio: -0.02 },
	{ minSize: 18, ratio: -0.015 },
	{ minSize: 0, ratio: -0.01 },
]

/** Negative tracking for the display face at `fontSize`, in the absolute units RN styles take. */
export const displayLetterSpacing = (fontSize: number): number => {
	if (!Number.isFinite(fontSize) || fontSize <= 0) {
		return 0
	}
	const band = TRACKING_RATIO_BANDS.find((entry) => fontSize >= entry.minSize)
	const ratio = band?.ratio ?? 0
	// Two decimals: RN honours fractional tracking, and rounding here keeps the value stable across
	// the theme, the Text component and any style file that derives one, so the same size can never
	// produce two different-looking numbers in a diff.
	return Math.round(fontSize * ratio * 100) / 100
}

/**
 * The Paper/`Text` variants set in the display face, and therefore the ones whose tracking the theme
 * already carries. A caller that overrides `fontSize` on one of these is re-tracked by `Text` for the
 * size actually rendered — the theme's value was computed for the variant's own size and is wrong the
 * moment that size changes.
 */
export const DISPLAY_FACE_VARIANTS = [
	'displaySmall',
	'displayMedium',
	'displayLarge',
	'headlineSmall',
	'headlineMedium',
	'headlineLarge',
	'titleSmall',
	'titleMedium',
	'titleLarge',
] as const

export type DisplayFaceVariant = (typeof DISPLAY_FACE_VARIANTS)[number]

export const isDisplayFaceVariant = (variant: unknown): variant is DisplayFaceVariant =>
	typeof variant === 'string' && (DISPLAY_FACE_VARIANTS as readonly string[]).includes(variant)
