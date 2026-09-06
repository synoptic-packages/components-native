import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'
import { fonts } from '../../../theme/fonts'

export const styles = {
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		height: input.height - 8,
		borderBottomWidth: input.borderWidth,
		paddingHorizontal: 0,
	},
	amountInput: {
		flex: 1,
		fontSize: 18,
		fontFamily: fonts.regular,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 4,
	},
	currencyPicker: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		minWidth: 90,
		maxWidth: 94,
		gap: 4,
	},
	currencyCode: {
		fontSize: input.fontSize,
		fontFamily: fonts.regular,
		backgroundColor: 'transparent',
		paddingHorizontal: 2,
	},
} as const satisfies StyleObject
