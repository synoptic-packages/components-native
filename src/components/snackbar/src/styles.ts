import type { StyleObject } from '../../../hooks/useTheme'

const styles = {
	container: {
		borderRadius: 16,
	},
	iconBadge: {
		margin: 0,
		padding: 0,
		width: 28,
		height: 28,
		borderRadius: 19,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.7)',
	},
	message: {
		margin: 0,
		top: 2,
		fontWeight: '700',
	},
} as const satisfies StyleObject

export default styles
