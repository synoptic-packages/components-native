import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	outer: {
		width: '100%',
		alignSelf: 'center',
		borderRadius: 32,
	},
	content: {
		padding: 20,
		borderRadius: 32,
		backgroundColor: 'bgLighter',
	},
	loadingState: {
		minHeight: 220,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	actions: {
		marginTop: 12,
		gap: 12,
	},
	endAdornment: {
		marginTop: 20,
		alignItems: 'center',
	},
} as const satisfies StyleObject
