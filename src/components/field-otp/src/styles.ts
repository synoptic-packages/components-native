import { PixelRatio } from 'react-native'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	wrapper: {
		marginBottom: PixelRatio.roundToNearestPixel(16),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
} as const satisfies StyleObject
