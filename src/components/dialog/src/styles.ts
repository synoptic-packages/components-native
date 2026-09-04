import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		flex: 1,
		width: '100%',
		paddingHorizontal: 0,
		backgroundColor: `modalOpacity`,
		flexDirection: 'column',
		alignItems: 'center',
	},
	content: {
		width: '100%',
		paddingHorizontal: 20,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
	},
	closeButton: {
		zIndex: 9999,
		position: 'absolute',
		right: 20,
		top: 20,
		backgroundColor: 'bg',
		borderRadius: '100%',
		padding: 4,
	},
	contentInner: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		width: '100%',
		height: 100,
	},
} as const satisfies StyleObject
