import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		flex: 1,
		paddingHorizontal: 0,
		backgroundColor: 'modalOpacity',
		flexDirection: 'column',
		alignItems: 'center',
	},
	content: {
		width: '100%',
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
	},
	contentInner: {
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		width: '100%',
		height: 100,
	},
} as const satisfies StyleObject
