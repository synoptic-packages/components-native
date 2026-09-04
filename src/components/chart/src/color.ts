import type { ThemeColors } from '../../../theme/colors'

/**
 * Which colour a chart line is drawn in.
 *
 * A chart is one of the few places a colour legitimately arrives as DATA rather than as a style: an
 * asset's brand colour is a backend field, so the line under a gold glyph is gold because the record
 * says so. That is not a licence to hardcode one — a caller passes either a semantic token name, which
 * is resolved against the active tenant's theme, or a value the record supplied.
 *
 * Anything else falls back to `primary`. A backend colour field can be absent, empty, or a fragment
 * (`PriceChart` guarded against exactly that before the chart was shared), and React Native's handling
 * of an unparseable colour string differs by platform — so an unusable value must resolve to a real
 * token here rather than reach the renderer.
 */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

export const chartLineColor = (requested: string | undefined, colors: ThemeColors): string => {
	const value = typeof requested === `string` ? requested.trim() : ``

	if (value && value in colors) return String(colors[value as keyof ThemeColors])

	if (HEX.test(value)) return value

	return String(colors.primary)
}
