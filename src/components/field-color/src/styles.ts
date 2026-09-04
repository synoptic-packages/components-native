import { input } from '../../../constants/index'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	input: {
		backgroundColor: 'transparent',
		fontSize: input.fontSize,
		height: input.height,
		borderRadius: input.borderRadius,
	},
	inputContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	swatchButton: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 1,
		borderColor: 'divider',
		marginRight: 10,
	},
	nativeInput: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
	},
	chevronButton: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 8,
		minHeight: input.height,
		paddingLeft: 8,
		paddingRight: 0,
	},
	chevronIconDisabled: {
		opacity: 0.35,
	},
	modalRoot: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalSheet: {
		backgroundColor: 'bg',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 16,
		paddingBottom: 24,
		paddingHorizontal: 16,
		maxHeight: '82%',
		marginBottom: 0,
	},
	modalHeader: {
		marginBottom: 16,
	},
	pickerCard: {
		backgroundColor: 'bgLighter',
		borderRadius: 20,
		padding: 16,
	},
	picker: {
		width: '100%',
	},
	preview: {
		borderRadius: 14,
		marginBottom: 12,
	},
	panel: {
		borderRadius: 16,
		marginBottom: 14,
	},
	slider: {
		borderRadius: 999,
		marginBottom: 14,
	},
	inputWidgetContainer: {
		marginBottom: 14,
	},
	inputWidgetInput: {
		borderWidth: 1,
		borderColor: 'divider',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: 'bg',
	},
	inputWidgetTitle: {
		marginTop: 8,
	},
	swatches: {
		marginTop: 4,
	},
	swatchOption: {
		borderRadius: 999,
		borderWidth: 2,
		borderColor: 'bg',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 16,
		gap: 12,
	},
	actionButton: {
		minWidth: 120,
	},
} as const satisfies StyleObject
