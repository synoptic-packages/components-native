import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	header: {
		marginBottom: 20,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	subTitle: {
		marginTop: 8,
		maxWidth: 280,
	},
	action: {
		marginTop: 12,
	},
	body: {
		gap: 12,
	},
} as const satisfies StyleObject
