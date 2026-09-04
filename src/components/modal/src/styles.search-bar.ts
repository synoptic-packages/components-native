import { input } from '../../../constants'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderRadius: 8,
		minHeight: 52,
	},
	iconSearch: {
		marginRight: 8,
	},
	inputColumn: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 10,
		height: 32,
		borderRadius: 8,
	},
	inputField: {
		fontSize: input.fontSize,
		padding: 0,
		margin: 0,
		flexGrow: 1,
	},
} as const satisfies StyleObject
