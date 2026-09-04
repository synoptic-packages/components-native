import { StyleSheet, Dimensions } from 'react-native'
import type { StyleObject } from '../../../hooks/useTheme'

const windowWidth = Dimensions.get('window').width

export const styles = {
	container: {
		height: 60,
		width: windowWidth - 40,
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 16,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 14,
		paddingRight: 10,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.1,
		shadowRadius: 9.11,
		elevation: 10,
	},
	message: {
		color: 'text',
		flexBasis: 50,
		flexGrow: 1,
		fontSize: 14,
		flexShrink: 1,
		paddingHorizontal: 14,
	},
	icon: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 21,
	},
	rightArrow: {
		width: 20,
	},
} as const satisfies StyleObject
