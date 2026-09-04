import type { StyleObject } from '../../../hooks/useTheme'

/**
 * The `alert` tongue and the handle beneath it.
 *
 * The tongue is pulled ABOVE the sheet with a negative margin and the sheet's own surface is redrawn
 * over its lower half — that overlap is the whole effect. The sheet reads as a card with a coloured
 * label tucked behind it, rather than a banner stacked on top, and because it all lives in
 * `handleComponent` it travels with the sheet when the sheet is dragged.
 */
export const styles = {
	tongue: {
		borderTopLeftRadius: 22,
		borderTopRightRadius: 22,
		overflow: 'hidden',
	},
	tongueLabel: {
		paddingHorizontal: 20,
		paddingTop: 7,
		paddingBottom: 9,
	},
	// Redraws the sheet's surface over the tongue's lower half, corners and all. Its radius is the
	// sheet's, deliberately tighter than the tongue's, so the two curves read as nested rather than
	// concentric.
	surface: {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingTop: 8,
	},
	indicator: {
		alignSelf: 'center',
		width: 42,
		height: 4,
		borderRadius: 2,
		marginBottom: 4,
		backgroundColor: 'divider',
	},
	handle: {
		paddingTop: 8,
	},
} as const satisfies StyleObject
