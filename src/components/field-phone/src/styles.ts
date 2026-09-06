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
	inputIcon: {
		marginLeft: 10,
		marginRight: -2,
	},
	countryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: input.height,
		paddingRight: 10,
	},
	flagWrap: {
		marginRight: 8,
	},
	countryCode: {
		marginTop: 1,
	},
	nativeInput: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
	},
} as const satisfies StyleObject
