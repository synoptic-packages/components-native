import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		width: '100%',
		minWidth: '100%',
		padding: 0,
		margin: 0,
		rowGap: 0,
		columnGap: 0,
		gap: 0,
	},
} as const satisfies StyleObject
