import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	recenter: {
		position: 'absolute',
		right: 16,
		bottom: 24,
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'bgLighter',
		shadowColor: 'black',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 4,
	},
	driverMarker: {
		shadowColor: 'black',
		shadowOpacity: 0.18,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
} as const satisfies StyleObject

/**
 * The recenter control's own footprint, read off its real style rather than duplicated as a literal
 * wherever a caller needs to reason about the space it occupies — `YayaMapFrame`'s recenter-offset
 * ceiling is the first of those, so the control cannot climb into the chrome row at a tall (90%) snap.
 */
export const MAP_RECENTER_CONTROL_SIZE = styles.recenter.height
