import { input } from '../../constants/index'
import type { StyleObject } from '../../hooks/useTheme'
import { PixelRatio } from 'react-native'

export const styles = {
	helper: {
		marginBottom: PixelRatio.roundToNearestPixel(4),
		width: '100%',
		minHeight: input.height,
	},
	helperText: {
		paddingLeft: 0,
	},
	// Paper's HelperText adds `paddingHorizontal: 12` unless `padding="none"`, and `helperText` above
	// only cancels the LEFT half — so centring without also zeroing the right would sit ~6px off centre.
	helperTextCentered: {
		textAlign: 'center',
		paddingRight: 0,
	},
} as const satisfies StyleObject
