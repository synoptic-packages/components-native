import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 300,
	},
} as const satisfies StyleObject
