import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: 'bg',
	},
	card: {
		width: '100%',
		maxWidth: 480,
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingVertical: 24,
		backgroundColor: 'bgLighter',
		alignItems: 'center',
	},
	iconWrap: {
		width: 72,
		height: 72,
		borderRadius: 36,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 24,
	},
	title: {
		textAlign: 'center',
		marginBottom: 8,
	},
	objectNumber: {
		opacity: 0.65,
		marginBottom: 6,
		textAlign: 'center',
	},
	subTitle: {
		opacity: 0.75,
		textAlign: 'center',
		marginBottom: 20,
	},
	actions: {
		width: '100%',
		gap: 18,
		marginTop: 24,
	},
	actionButton: {
		width: '100%',
	},
} as const satisfies StyleObject
