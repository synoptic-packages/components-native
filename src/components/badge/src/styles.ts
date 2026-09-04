import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		alignSelf: 'flex-start',
	},
	/**
	 * The badge is a `View` with a `Text` inside it, not a styled `Text`.
	 *
	 * React Native Paper's `Badge` is one `Animated.Text` carrying its own `height`, `minWidth` and
	 * `lineHeight`, and it leans on `textAlignVertical` — which Android honours and iOS ignores — to
	 * centre the glyphs inside that height. So the count sat off-centre in the circle on iOS, and the
	 * offset moved with the user's font scale because the `lineHeight` divides by it. A flex box with
	 * `justifyContent`/`alignItems` centres on both platforms, at any scale, with no metric to guess.
	 */
	badge: {
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	label: {
		textAlign: 'center',
		// The count must never wrap or the circle stretches vertically instead of horizontally.
		includeFontPadding: false,
	},
} as const satisfies StyleObject
