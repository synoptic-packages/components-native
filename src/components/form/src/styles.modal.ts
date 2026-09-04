import type { StyleObject } from '../../../hooks/useTheme'
import { StyleSheet } from 'react-native'

export const styles = {
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'modalOpacity',
	},
	sheet: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 60,
		paddingHorizontal: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	closeButtonSpacer: {
		width: 40,
		height: 40,
	},
	titleContainer: {
		flex: 1,
		minWidth: 0,
		marginLeft: 12,
		marginRight: 12,
		justifyContent: 'center',
	},
	title: {
		textAlign: 'left',
	},
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'bgLighter',
	},
	pressed: {
		opacity: 0.72,
	},
	headerAction: {
		flexShrink: 0,
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	submitButton: {
		paddingHorizontal: 12,
		borderRadius: 999,
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		padding: 0,
	},
} as const satisfies StyleObject
