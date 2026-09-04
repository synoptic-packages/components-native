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
	groupLabel: {
		marginBottom: 6,
	},
	optionsContainer: {
		width: '100%',
	},
	optionsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	optionRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%',
	},
	optionRowInline: {
		width: undefined,
		marginRight: 16,
		alignItems: 'flex-start',
	},
	radioWrap: {
		width: 42,
		minHeight: 24,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 2,
	},
	radioWrapInline: {
		width: 28,
		minHeight: 24,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 1,
		marginRight: 4,
	},
	radioIconDisabled: {
		opacity: 0.35,
	},
	optionContent: {
		flex: 1,
		paddingTop: 2,
	},
	optionContentInline: {
		flex: undefined,
		flexGrow: 0,
		flexShrink: 0,
		paddingTop: 2,
	},
	optionLabelInline: {
		paddingTop: 2,
	},
	optionHint: {
		paddingLeft: 0,
		marginLeft: 0,
		marginTop: 0,
		paddingTop: 0,
	},
	helperText: {
		paddingLeft: 0,
		marginLeft: 0,
		marginTop: 0,
	},
} as const satisfies StyleObject
