import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	bar: {
		height: 4,
	},
	container: {
		gap: 8,
	},
	// The segmented variant. Equal-width bars sharing one row, so the strip always spans its container
	// whatever the segment count — the stage boundaries stay on a grid rather than drifting with it.
	segments: {
		flexDirection: 'row',
		gap: 6,
	},
	segment: {
		flex: 1,
		height: 4,
		borderRadius: 2,
	},
} as const satisfies StyleObject
