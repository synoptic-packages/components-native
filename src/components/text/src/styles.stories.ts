import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	screen: {
		flex: 1,
	},
	content: {
		padding: 24,
		paddingBottom: 40,
	},
	lead: {
		lineHeight: 24,
		marginBottom: 24,
	},
	section: {
		marginBottom: 12,
	},
	sectionDescription: {
		lineHeight: 22,
		marginBottom: 12,
	},
	divider: {
		marginBottom: 12,
	},
} as const satisfies StyleObject
