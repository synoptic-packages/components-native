import { PixelRatio } from 'react-native'

import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		marginBottom: PixelRatio.roundToNearestPixel(4),
		marginTop: PixelRatio.roundToNearestPixel(8),
		width: '100%',
		minHeight: input.height,
	},
	title: {
		marginBottom: 6,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%',
		minHeight: input.height,
	},
	checkboxWrap: {
		width: 36,
		minHeight: 24,
		flexDirection: 'row',
		justifyContent: `flex-start`,
		alignItems: 'center',
		paddingTop: 2,
	},
	checkboxIconDisabled: {
		opacity: 0.35,
	},
	content: {
		flex: 1,
		paddingTop: 6,
		paddingLeft: 4,
	},
	helperText: {
		paddingLeft: 0,
		marginLeft: 0,
		marginTop: 0,
	},
} as const satisfies StyleObject
