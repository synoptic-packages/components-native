import { Icon, type IconFamily, type IconName } from '../../icon/index'
import { useTheme } from '../../../hooks/useTheme'
import { ensureContrast, mixColors, preferredForeground } from '../../../lib/color'
import React, { type ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { baseStyles, sizeStyles } from './styles'

export type ChipVariant = 'filled' | 'outlined'
export type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
export type ChipSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface ComponentProps {
	label: ReactNode
	/**
	 * The leading glyph.
	 *
	 * A STATUS chip defaults to the dot it has always shown. A SELECTABLE chip (`selected` set)
	 * defaults to NO glyph, because a filter pill without one is normal — `Saved` and `Nearby` have
	 * none, and defaulting them to a status dot would put a mark on them that never existed.
	 */
	icon?: IconName
	iconFamily?: IconFamily
	variant?: ChipVariant
	color?: ChipColor
	size?: ChipSize
	/**
	 * Selection state for a chip the user CHOOSES between, as opposed to one that reports a status.
	 *
	 * Leave it undefined for a status chip and the `variant`/`color` treatment applies unchanged. Set
	 * it and the chip renders the filter-pill treatment instead. That pair was hand-rolled on the rider
	 * home's Home/Saved/Nearby row; it lives here so a second row of pills cannot drift from the first.
	 *
	 * SELECTED is the only one that fills — `bgLighter` — and it carries a BRAND border: `primary` in
	 * light, `accent` in dark. The fill alone was doing all the work, and on a busy map strip a filled
	 * pill against `bg` is a weak signal; the border is what makes the current tab unambiguous. The
	 * two schemes need different tokens because `primary` is the deep brand orange — legible on a light
	 * surface and muddy against a dark one, where the lighter `accent` is what reads.
	 */
	selected?: boolean
	/**
	 * Colour of a SELECTED pill's label and icon.
	 *
	 * The default `'text'` is the product-switcher status quo: only the fill and the brand border
	 * carry selection, and both states keep the `text` label. `'brand'` opts the selected pill into
	 * the brand colour instead — `primary` in light, `accent` in dark, the same pair the border uses
	 * — so the current tab reads through its label and glyph as well as its outline. `'accent'` in
	 * dark is required for the same reason the border needs it: `primary` is legible on a light
	 * surface and muddy against a dark one.
	 */
	selectedColor?: 'text' | 'brand'
	disabled?: boolean
	onPress?: () => void
	testID?: string
	accessibilityLabel?: string
}

/**
 * How much of the semantic colour an outlined chip's fill carries.
 *
 * Blended into the surface rather than laid over it at 10% alpha, so the result is a real colour the
 * contrast arithmetic below can read. See `mixColors`.
 */
const OUTLINED_TINT = 0.12

/**
 * How much of the semantic colour an outlined chip's border carries.
 *
 * It used to be the full-strength colour, which made the ring the loudest thing on the chip while the
 * label — the part carrying the actual word — was the quietest. That inverts the hierarchy: size and
 * colour should rank things, and a hairline outline is the least important of the three. Holding the
 * border at 45% leaves the shape unmistakable and lets the label lead.
 */
const OUTLINED_BORDER = 0.45

export const Component: React.FC<ComponentProps> = ({
	label,
	icon,
	iconFamily,
	variant = 'outlined',
	color = 'default',
	size = 'medium',
	selected,
	selectedColor = 'text',
	disabled = false,
	onPress,
	testID,
	accessibilityLabel,
}) => {
	const { colors, isDark } = useTheme()
	const tokens = sizeStyles[size]

	// The chip sits on a page or on a card, and in both schemes those two surfaces are close enough
	// that either is a safe base for the blend. `bgLighter` is the one a status chip most often lands
	// on — a list row inside a card — and it is the lighter of the pair in light mode, which is the
	// harder case for a coloured label.
	const surface = String(colors.bgLighter)
	const colorValue = color === 'default' ? String(colors.text) : String(colors[color])

	const bgColor =
		variant === 'filled'
			? color === 'default'
				? surface
				: colorValue
			: color === 'default'
				? surface
				: mixColors(colorValue, surface, OUTLINED_TINT)

	const borderColor =
		color === 'default'
			? String(colors.divider)
			: variant === 'filled'
				? colorValue
				: mixColors(colorValue, surface, OUTLINED_BORDER)

	// A FILLED chip's foreground is measured against its own fill rather than read off a list of
	// "colours dark enough for white". That list was hand-maintained and could only ever be right for the
	// brand tokens someone had checked — and nothing stops a brand token being a pale gold, which is
	// exactly what `primary` is here: white-on-it fails silently at 11pt on somebody else's phone.
	//
	// An OUTLINED chip's foreground is the semantic colour shaded until it clears AA on the tint it
	// sits on. Painted raw, `success` on a pale green fill measures ~2.8:1 — which is the illegible
	// `APPROVED` pill this component shipped. The shade keeps the hue, so the status still reads green
	// at a glance; it only stops being a whisper.
	const foreground =
		variant === 'filled'
			? color === 'default'
				? String(colors.text)
				: preferredForeground(bgColor, String(colors.white), String(colors.text))
			: color === 'default'
				? String(colors.text)
				: ensureContrast(colorValue, bgColor)

	// Selection overrides the status treatment entirely — see the `selected` prop. It is checked with
	// `!== undefined` so `selected={false}` renders the UNSELECTED pill rather than falling through to
	// the status colours, which is the whole point of the pair.
	const isSelectable = selected !== undefined
	// See the `icon` prop: a status chip keeps its dot, a pill renders nothing unless asked.
	const showsDot = !icon && !isSelectable
	const selectedBg = selected ? String(colors.bgLighter) : String(colors.bg)
	const selectedBorder = selected ? String(isDark ? colors.accent : colors.primary) : String(colors.divider)
	// Both states use `text` unless `selectedColor` opts the selected pill into the brand — the same
	// `primary`/`accent` pair the border uses. Only the fill, the border, the weight below and this
	// colour carry selection.
	const brandSelected = Boolean(selected) && selectedColor === 'brand'
	const selectedText = brandSelected ? String(isDark ? colors.accent : colors.primary) : String(colors.text)
	const selectedIcon: 'text' | 'accent' | 'primary' = brandSelected ? (isDark ? 'accent' : 'primary') : 'text'

	const mutedForeground = String(colors.muted)
	const resolvedForeground = disabled ? mutedForeground : isSelectable ? selectedText : foreground

	const chipStyle = [
		baseStyles.chip,
		tokens.chip,
		{
			backgroundColor: disabled ? String(colors.bgLighter) : isSelectable ? selectedBg : bgColor,
			borderColor: disabled ? String(colors.divider) : isSelectable ? selectedBorder : borderColor,
			opacity: disabled ? 0.5 : 1,
			// A chip with no leading mark has nothing to compensate for, so its left inset matches its
			// right one. Only the dot and glyph sizes earned the tighter lead-in.
			...(showsDot || icon ? null : { paddingLeft: tokens.chip.paddingRight }),
		},
	]

	// A selected pill is normally bolder. `xlarge` opts out: it sets its own font FAMILY, and a
	// fontWeight applied over a custom family drops the family on both platforms — the same trap the
	// repo records for `<Text fontFamily="wide" bold>`. There, selection reads from the filled surface
	// and the border instead, which is what distinguishes the pills in the benchmark app too.
	const labelKeepsFontFamily = size === 'xlarge'
	const labelStyle = [
		tokens.label,
		isSelectable && !labelKeepsFontFamily ? { fontWeight: selected ? ('700' as const) : ('400' as const) } : null,
		{ color: resolvedForeground },
	]

	// The dot rides `dotNudge` above the row's centre line to land on the label's optical centre rather
	// than its text box's geometric one — see `dotNudge`. An explicit `icon` keeps the shared `Icon`
	// and the icon scale; only the status dot is geometry.
	const leading = showsDot ? (
		<View
			style={[
				baseStyles.dot,
				{
					width: tokens.dotSize,
					height: tokens.dotSize,
					backgroundColor: resolvedForeground,
					marginTop: -tokens.dotNudge,
				},
			]}
		/>
	) : icon ? (
		<Icon
			family={iconFamily}
			name={icon}
			size={tokens.iconSize}
			color={disabled ? 'muted' : isSelectable ? selectedIcon : resolvedForeground}
			style={{ marginTop: -tokens.dotNudge }}
		/>
	) : null

	if (onPress && !disabled) {
		return (
			<Pressable
				onPress={onPress}
				accessibilityRole={`button`}
				{...(isSelectable ? { accessibilityState: { selected: Boolean(selected) } } : {})}
				accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}
				style={({ pressed }) => [...chipStyle, pressed && { opacity: 0.7 }]}
				testID={testID}>
				{leading}
				<Text style={labelStyle}>{label}</Text>
			</Pressable>
		)
	}

	return (
		<View style={chipStyle} testID={testID} accessibilityLabel={accessibilityLabel}>
			{leading}
			<Text style={labelStyle}>{label}</Text>
		</View>
	)
}
