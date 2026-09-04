import type { StyleObject } from '../../../hooks/useTheme'
import { StyleSheet, type ViewStyle } from 'react-native'

export const styles = {
	container: {
		width: '100%',
		minWidth: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		paddingHorizontal: 10,
	},
} as const satisfies StyleObject

export const getContainerStyle = (height: number): ViewStyle => ({
	height,
})

export const getLineStyle = (backgroundColor: string): ViewStyle => ({
	backgroundColor,
	flexBasis: 50,
	flexGrow: 1,
	flexShrink: 1,
	height: StyleSheet.hairlineWidth,
})
