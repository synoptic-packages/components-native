import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	container: {
		flexDirection: 'row',
		height: 42,
		borderRadius: 18,
		padding: 3,
	},
	containerPlain: {
		height: 32,
		padding: 0,
	},
	segment: {
		flex: 1,
		height: '100%',
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},
	leftRounded: {
		borderTopLeftRadius: 18,
		borderBottomLeftRadius: 18,
	},
	rightRounded: {
		borderTopRightRadius: 18,
		borderBottomRightRadius: 18,
	},
} as const satisfies StyleObject
