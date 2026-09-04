import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	wrapper: {
		marginBottom: 12,
	},
	title: {
		marginBottom: 4,
		marginTop: 20,
		paddingHorizontal: 4,
		textTransform: 'uppercase',
		letterSpacing: 0.6,
		color: 'muted',
	},
	// The card chrome is gone deliberately: a filled, rounded container around every list repeated
	// the page's own surface and inset the rows twice (card padding, then row padding). Rows now sit
	// on the page background separated by their dividers — the same flat treatment the `ui` console
	// settled on, and the one that reads as a native settings list rather than a stack of tiles.
	card: {
		backgroundColor: 'transparent',
		overflow: 'hidden',
	},
	cardListPadding: {
		paddingVertical: 0,
	},
	disabled: {
		opacity: 0.5,
	},
	footer: {
		marginTop: 8,
		paddingHorizontal: 4,
		color: 'muted',
	},
} as const satisfies StyleObject
