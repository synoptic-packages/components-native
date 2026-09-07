import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		overflow: 'visible',
	},
	avatar: {
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		backgroundColor: 'bgLighter',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'modalOpacity',
	},
	editBadge: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: 'bg',
		backgroundColor: 'primary',
	},
} as const satisfies StyleObject
