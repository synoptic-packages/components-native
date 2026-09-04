import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	skeleton: {
		flex: 1,
		padding: 12,
	},
	checkboxRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
} as const satisfies StyleObject
