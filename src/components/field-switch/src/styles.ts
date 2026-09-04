import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%',
		minHeight: input.height,
	},
	switch: {
		borderRadius: 16,
		marginTop: 2,
	},
	label: {
		flex: 1,
		marginLeft: 12,
		marginTop: 6,
	},
} as const satisfies StyleObject
