import { fonts } from '../../../theme/fonts'
import { PixelRatio } from 'react-native'

export const sizeStyles = {
	small: {
		paddingHorizontal: PixelRatio.roundToNearestPixel(2),
		paddingVertical: PixelRatio.roundToNearestPixel(0),
		borderRadius: PixelRatio.roundToNearestPixel(9999),
	},
	medium: {
		paddingHorizontal: PixelRatio.roundToNearestPixel(4),
		paddingVertical: PixelRatio.roundToNearestPixel(3),
		borderRadius: PixelRatio.roundToNearestPixel(9999),
	},
	large: {
		paddingHorizontal: PixelRatio.roundToNearestPixel(6),
		paddingVertical: PixelRatio.roundToNearestPixel(6),
		borderRadius: PixelRatio.roundToNearestPixel(9999),
	},
}

export const sizeLabelStyles = {
	small: {
		fontSize: 10,
		fontWeight: '400',
		fontFamily: fonts.regular,
	},
	medium: {
		fontSize: 11,
		fontWeight: '500',
		fontFamily: fonts.regular,
	},
	large: {
		fontSize: 13,
		fontWeight: '600',
		fontFamily: fonts.regular,
	},
}
