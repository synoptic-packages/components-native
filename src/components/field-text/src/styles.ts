import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	input: {
		backgroundColor: 'transparent',
		fontSize: input.fontSize,
		height: input.height,
		borderRadius: input.borderRadius,
	},
	inputContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftAdornment: {
		marginRight: 10,
	},
	rightAdornment: {
		marginLeft: 10,
		marginRight: -2,
	},
	rightIcon: {
		marginLeft: 10,
		marginRight: -2,
	},
	rightIconButton: {
		marginLeft: 10,
		marginRight: -2,
		minHeight: input.height,
		paddingLeft: 4,
	},
	nativeInput: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
	},
} as const satisfies StyleObject
