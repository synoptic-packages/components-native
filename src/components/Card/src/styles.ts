import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		backgroundColor: 'bgLighter',
		borderRadius: 12,
		overflow: 'hidden',
	},
	headerContainer: {
		flexShrink: 0,
	},
	bodyContainer: {
		overflow: 'hidden',
	},
	bodyScroll: {
		flex: 1,
	},
	bodyContent: {
		flexGrow: 1,
	},
	footerContainer: {
		flexShrink: 0,
	},
} as const satisfies StyleObject
