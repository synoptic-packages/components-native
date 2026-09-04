import type { StyleObject } from '../../../hooks/useTheme'
import { StyleSheet, type ViewStyle } from 'react-native'

export const CONTAINER_HORIZONTAL_PADDING = 8
export const LEFT_CONTENT_GAP = 12
// The leading column is a glyph slot, not a chip: 32 matches `ListIcon`'s container so the divider
// inset lands exactly where the text starts.
export const LEFT_CONTENT_SIZE = 32

export const styles = {
	containerWrapper: {
		width: '100%',
		minWidth: '100%',
		marginTop: 0,
		marginBottom: 0,
		paddingTop: 0,
		paddingBottom: 0,
	},
	container: {
		width: '100%',
		minWidth: '100%',
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: CONTAINER_HORIZONTAL_PADDING,
		paddingTop: 0,
		paddingBottom: 0,
		marginTop: 0,
		marginBottom: 0,
	},
	leftContainer: {
		marginRight: LEFT_CONTENT_GAP,
		flexDirection: 'row',
		justifyContent: `center`,
		alignItems: 'center',
	},
	middleContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingVertical: 10,
	},
	subTitle: {
		marginTop: 0,
		marginBottom: 2,
	},
	rightContainer: {
		minWidth: 32,
		marginLeft: 12,
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: `flex-end`,
		alignItems: 'center',
	},
	rightContainerCentered: {
		justifyContent: `center`,
	},
	rightContent: {
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'divider',
	},
	disabled: {
		opacity: 0.5,
	},
} as const satisfies StyleObject

export const getDividerStyle = (left: number): ViewStyle => ({
	left,
})
