import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
		minHeight: input.height,
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: 'bgLighter',
	},
	iconSearch: {
		marginRight: 8,
	},
	inputField: {
		flex: 1,
		fontSize: input.fontSize,
		padding: 0,
		margin: 0,
		backgroundColor: 'transparent',
	},
} as const satisfies StyleObject
