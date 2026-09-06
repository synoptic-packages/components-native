import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		gap: 12,
	},
	preview: {
		height: 180,
		borderRadius: 16,
		overflow: 'hidden',
		backgroundColor: 'bgLighter',
		borderWidth: 1,
		borderColor: 'divider',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	placeholder: {
		gap: 8,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	actions: {
		flexDirection: 'row',
		gap: 10,
	},
	actionButton: {
		flex: 1,
		minHeight: 44,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'divider',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	actionButtonPrimary: {
		backgroundColor: 'bgLighter',
	},
	actionButtonDanger: {
		backgroundColor: 'bg',
	},
} as const satisfies StyleObject
