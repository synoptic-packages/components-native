import type { StyleObject } from '../../../hooks/useTheme'
import { Platform } from 'react-native'

/**
 * Shadows only. Everything else on this bar is expressible as an inline prop on the shared
 * `View`/`Pressable`, and the repo's rule is to use those; a shadow is not — `shadowOffset` is a
 * nested object and `elevation` is a native prop, so both have to arrive through `style`.
 *
 * `shadowColor: 'black'` is a semantic token resolved by `setStylesheet`, not a literal.
 */
export const styles = {
	/**
	 * The pill's own shadow, unchanged from the product bar this component was extracted from: a soft
	 * downward cast that lifts it off the screen beneath.
	 */
	pillShadow:
		Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.16,
				shadowRadius: 16,
			},
			android: { elevation: 8 },
		}) ?? {},

	/**
	 * The transparent layer the raised disc sits in.
	 *
	 * Android sorts a ViewGroup's children by elevation BEFORE it honours their order in the tree, so
	 * a disc declared after the pill still draws underneath it — precisely where it is meant to break
	 * the pill's top edge. Out-elevating the pill is what fixes that. The layer carries no background,
	 * so Android's outline provider has nothing to cast from and the elevation buys ordering without a
	 * second shadow.
	 */
	centerLayer: Platform.select({ android: { elevation: 12 } }) ?? {},

	/**
	 * The disc's shadow. Same colour, same downward offset and same blur as the pill's — one light
	 * source, not two — and one step more opaque because the disc genuinely sits in front of it.
	 */
	centerShadow:
		Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.22,
				shadowRadius: 16,
			},
			android: { elevation: 12 },
		}) ?? {},
} as const satisfies StyleObject
