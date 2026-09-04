import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	// A bare glyph in a fixed column, not a filled chip. The 52px circle it replaced set the row
	// height on its own and gave every leading icon a second background to sit on.
	container: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
} as const satisfies StyleObject
