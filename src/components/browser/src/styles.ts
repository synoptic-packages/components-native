import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		flex: 1,
		backgroundColor: 'bg',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingBottom: 12,
		backgroundColor: 'bgLighter',
		borderBottomWidth: 1,
		borderColor: 'divider',
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	headerButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'bg',
	},
	headerButtonDisabled: {
		opacity: 0.45,
	},
	content: {
		flex: 1,
		backgroundColor: 'bg',
	},
	webView: {
		flex: 1,
		backgroundColor: 'bg',
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
		backgroundColor: 'bg',
	},
	emptyTitle: {
		color: 'text',
		marginBottom: 8,
	},
	emptyMessage: {
		color: 'muted',
		maxWidth: 320,
	},
} as const satisfies StyleObject
