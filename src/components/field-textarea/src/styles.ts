import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	input: {
		backgroundColor: 'transparent',
		fontSize: input.fontSize,
		borderRadius: input.borderRadius,
		minHeight: input.height * 2,
	},
} as const satisfies StyleObject
