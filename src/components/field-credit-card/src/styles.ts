import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	row: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 16,
	},
	cardField: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: input.height,
		borderBottomWidth: input.borderWidth,
	},
	cardInput: {
		flex: 1,
		fontSize: input.fontSize,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
	},
	cardImage: {
		width: 36,
		height: 24,
	},
	cvvField: {
		width: 64,
		flexDirection: 'row',
		alignItems: 'center',
		height: input.height,
		borderBottomWidth: input.borderWidth,
	},
	cvvInput: {
		flex: 1,
		fontSize: input.fontSize,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
		textAlign: 'center',
	},
} as const satisfies StyleObject
