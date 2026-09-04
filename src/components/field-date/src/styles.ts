import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		height: input.height,
		borderBottomWidth: input.borderWidth,
		paddingHorizontal: 0,
	},
	input: {
		flex: 1,
		fontSize: input.fontSize,
		backgroundColor: 'transparent',
		paddingLeft: 0,
	},
} as const satisfies StyleObject
