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
	addButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		minHeight: input.height,
		marginRight: -2,
	},
	addIconDisabled: {
		opacity: 0.5,
	},
	nativeInput: {
		flex: 1,
		paddingLeft: 0,
		paddingRight: 0,
		backgroundColor: 'transparent',
	},
	itemsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 12,
	},
} as const satisfies StyleObject
