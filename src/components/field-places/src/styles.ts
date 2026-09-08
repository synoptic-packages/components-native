import { input as inputConstants } from '../../../constants'
import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	input: {
		backgroundColor: 'transparent',
		fontSize: inputConstants.fontSize,
		height: inputConstants.height,
		borderRadius: inputConstants.borderRadius,
	},
	inputContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	nativeInput: {
		flex: 1,
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
	},
	rightIconButton: {
		marginLeft: 10,
		marginRight: -2,
		minHeight: inputConstants.height,
		paddingLeft: 4,
	},
	// NO BOUNDING BOX. This carried a 1pt `divider` border, an 8pt radius, its own `bg` surface and a
	// four-way drop shadow (`elevation: 6`), so results arrived as a floating card stacked on the sheet
	// the field already sits on — two nested containers for one list. The rows below own their own
	// separation now, exactly as the benchmark's results do: flat, hairline-divided, on the surface
	// behind them. Only the gap off the input survives.
	suggestionsList: {
		marginTop: 2,
	},
	// Compact, and flush with the input's own text column. The card is gone, so the row no longer pays
	// for a container inset: 16pt of horizontal padding pushed every result inboard of the field that
	// produced it, and 16pt of vertical padding put three results where five fit. The surface is
	// inherited rather than painted — a row that fills `bgLighter` over a `bg` sheet is a card by
	// another name.
	suggestionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 0,
		paddingVertical: 10,
	},
	suggestionDivider: {
		borderBottomWidth: 1,
		borderBottomColor: 'divider',
	},
	placeIcon: {
		marginRight: 12,
	},
} as const satisfies StyleObject
