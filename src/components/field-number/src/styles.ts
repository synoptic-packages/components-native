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
	stepButtonLeft: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingRight: 10,
		minHeight: input.height,
	},
	stepButtonRight: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		minHeight: input.height,
		marginRight: -2,
	},
	stepIconLeftCustom: {
		marginRight: 10,
	},
	stepIconRightCustom: {
		marginLeft: 10,
		marginRight: -2,
	},
	stepIconDisabled: {
		opacity: 0.35,
	},
	nativeInput: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
		minWidth: 0,
		textAlign: 'right',
	},
	prefixText: {
		marginRight: 8,
	},
	suffixText: {
		marginLeft: 8,
	},
} as const satisfies StyleObject
