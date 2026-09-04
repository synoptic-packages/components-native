import type { StyleObject } from '../../../hooks/useTheme'
import { fonts } from '../../../theme/fonts'

export const baseStyles = {
	chip: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		borderWidth: 1,
	},
	/**
	 * The status dot is GEOMETRY, not an icon.
	 *
	 * It used to be the `SyCircleFilled` glyph sized by the icon scale, which meant its real diameter
	 * was whatever padding that SVG's viewBox happened to carry — a 9pt box drew a 6.7pt dot — and its
	 * centre was the centre of an icon box being aligned against a TEXT box. A text box is taller than
	 * the letters it holds and asymmetric about them, so the dot sat visibly low against the label,
	 * worst on the all-caps status chips where the eye has a hard cap line to compare it to.
	 *
	 * A `View` with an explicit diameter fixes both: the size is the size, and `dotNudge` below is the
	 * one deliberate optical correction rather than an accident of two mismatched boxes. An explicit
	 * `icon` still renders through the shared `Icon` — this replaces the dot only.
	 */
	dot: {
		borderRadius: 999,
	},
} as const satisfies StyleObject

export interface ChipSizeTokens {
	chip: {
		paddingLeft: number
		paddingRight: number
		paddingVertical: number
		borderRadius: number
		borderWidth?: number
		gap: number
	}
	label: {
		fontSize: number
		lineHeight: number
		fontWeight?: '400' | '500' | '700'
		fontFamily: string
	}
	/** Diameter of the status dot, drawn as geometry. */
	dotSize: number
	/**
	 * How far the dot rides ABOVE the row's centre line, in points.
	 *
	 * `alignItems: 'center'` centres the label's text box, and a text box holds ascender and descender
	 * room the glyphs do not fill — so its optical centre (the middle of the cap height, or of the
	 * x-height for lowercase) sits above its geometric centre. A dot centred on the box therefore reads
	 * low. Roughly a tenth of the font size corrects it, which is why this scales with the size rather
	 * than being one constant.
	 */
	dotNudge: number
	/** Size of an explicit `icon`, which is a glyph and keeps the icon scale. */
	iconSize: number
}

/**
 * The two STATUS sizes, `small` and `medium`, annotate something that already exists — a row's state,
 * a card's stage. The two SELECTABLE sizes, `large` and `xlarge`, are pills the user taps to make a
 * choice, and they are deliberately a different object with a real tap target.
 *
 * Every one of them is `borderRadius: 999`. They sit together on the same screens, and things that sit
 * together share their geometry: `small`'s 12 and `medium`'s 16 were fully round only by accident of
 * exceeding half the height, and became rounded rectangles the moment a label wrapped.
 */
export const sizeStyles = {
	small: {
		chip: {
			paddingLeft: 8,
			paddingRight: 10,
			paddingVertical: 3,
			borderRadius: 999,
			gap: 5,
		},
		label: {
			// 11, not 9. Nine points is below what either platform considers readable, and it is the size
			// 24 of this repo's status chips ask for — the trailing `APPROVED` on a list row, the stage on
			// an order card. Small is a rank, not a dare.
			fontSize: 11,
			lineHeight: 14,
			fontWeight: '500' as const,
			fontFamily: fonts.regular,
		},
		dotSize: 6,
		dotNudge: 1,
		iconSize: 11,
	},
	medium: {
		chip: {
			// Symmetric. It was 6 left / 12 right, tuned around a glyph whose own box padding was already
			// doing the compensating, so the dot ended up crowded against the pill's left curve while the
			// label had half again as much air on the right. A round element against a round edge wants
			// the same inset as the text, not half of it.
			paddingLeft: 10,
			paddingRight: 12,
			paddingVertical: 5,
			borderRadius: 999,
			gap: 6,
		},
		label: {
			fontSize: 12,
			lineHeight: 16,
			fontWeight: '500' as const,
			fontFamily: fonts.regular,
		},
		dotSize: 7,
		dotNudge: 1,
		iconSize: 13,
	},
	// The FILTER PILL. `small`/`medium` are status chips, sized to annotate a row. A pill the user taps
	// to make a choice is a different object and needs a real tap target, so it is a size rather than a
	// second component: the rider home's Home/Saved/Nearby row hand-rolled these metrics as a Pressable,
	// and this is that treatment moved into the shared chip so the two cannot drift.
	large: {
		chip: {
			paddingLeft: 12,
			paddingRight: 12,
			paddingVertical: 6,
			borderRadius: 999,
			gap: 6,
		},
		label: {
			fontSize: 13,
			lineHeight: 17,
			fontWeight: '400' as const,
			fontFamily: fonts.regular,
		},
		dotSize: 8,
		dotNudge: 1,
		iconSize: 14,
	},
	// The PRODUCT SWITCHER pill. `large` filters a list that is already on screen; this one names a
	// product line and is the first thing on the surface, so it is bigger, it carries the WIDE display
	// face the rest of the product's headings use, and its border is 2pt rather than the hairline every
	// other chip wants — which is why it sets `borderWidth` itself instead of inheriting `baseStyles`.
	//
	// It deliberately declares NO `fontWeight`. A weight and a custom font FAMILY fight on both
	// platforms and the weight wins, dropping the family — the same trap the repo records for
	// `<Text fontFamily="wide" bold>`. Selection is carried by surface, border and colour instead.
	xlarge: {
		chip: {
			paddingLeft: 11,
			paddingRight: 11,
			// 5 rather than 7. The strip sits above the map and its height is pure chrome — every point
			// it takes is a point of map the rider does not see. The type and glyph scale are unchanged,
			// so only the pill shrinks: it stays well clear of the 44pt tap target because the row is
			// taller than the pill it contains.
			paddingVertical: 5,
			borderRadius: 999,
			borderWidth: 2,
			gap: 8,
		},
		label: {
			fontSize: 14,
			lineHeight: 19,
			fontFamily: fonts.wide,
		},
		dotSize: 9,
		dotNudge: 1.5,
		iconSize: 18,
	},
} as const satisfies Record<string, ChipSizeTokens>
