import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	graphicContainer: {
		width: '100%',
		overflow: 'hidden',
	},
	graphicImage: {
		width: '100%',
		height: '100%',
	},
	dotContainer: {
		gap: 8,
	},
	dotInactive: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'muted',
	},
	dotActive: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'primary',
	},
} as const satisfies StyleObject
