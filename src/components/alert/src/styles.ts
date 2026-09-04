import type { StyleObject } from '../../../hooks/useTheme'

const styles = {
	container: {
		width: '100%',
		borderRadius: 40,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 14,
		marginVertical: 8,
	},
	icon: {
		marginRight: 10,
		marginTop: 1,
	},
	message: {
		flex: 1,
		lineHeight: 14,
	},
} as const satisfies StyleObject

export default styles
