import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import { fonts } from '../../../theme/fonts'
import { preferredForeground } from '../../../lib/color'
import { type ReactNode } from 'react'
import { Text, View } from 'react-native'
import { styles } from './styles'

export type BadgeColor = Extract<
	ColorName,
	'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'accent' | 'muted'
>

export interface ComponentProps {
	children?: ReactNode
	label?: ReactNode
	/**
	 * Diameter of the badge, and the base its type is scaled from. The default 20 is the notification
	 * count that sits on an avatar or a tab icon.
	 */
	size?: number
	/**
	 * The fill. The label colour is DERIVED from it rather than passed in — see `preferredForeground`
	 * below — so a caller cannot pair an unreadable two.
	 */
	color?: BadgeColor
	/**
	 * Renders the marker with no label: the "there is something here" dot, at a third of `size`.
	 *
	 * It is a mode rather than a second component because it is the same object with nothing to count
	 * — an unread indicator on a row, a live signal on a tab. A badge with neither `children`, `label`
	 * nor `dot` renders nothing at all, which is what makes `<Badge>{count || null}</Badge>` safe.
	 */
	dot?: boolean
	visible?: boolean
	testID?: string
	accessibilityLabel?: string
}

/**
 * Type scale for the count, as a fraction of the badge's diameter.
 *
 * Paper's badge used a flat `size * 0.5`, which is 10pt at the default size — under what either
 * platform considers readable — and 17pt at the 34pt size the catalog shows, which is body copy
 * inside a circle. The ratio has to fall as the badge grows: a small badge needs proportionally more
 * of its circle given to the glyph, a large one needs less or the digits touch the edge. The floor
 * is what keeps the smallest badge legible at all.
 */
const LABEL_MIN = 11
const labelSizeFor = (size: number) => Math.max(LABEL_MIN, Math.round(size * (size <= 24 ? 0.58 : 0.46)))

export const Component = ({
	children,
	label,
	size = 20,
	color = 'primary',
	dot = false,
	visible = true,
	testID,
	accessibilityLabel,
}: ComponentProps) => {
	const { colors } = useTheme()
	const content = children ?? label

	if (!visible || (!dot && (content === null || content === undefined || content === ''))) {
		return null
	}

	const backgroundColor = String(colors[color])

	if (dot) {
		const diameter = Math.max(6, Math.round(size / 3))
		return (
			<View
				testID={testID}
				accessibilityLabel={accessibilityLabel}
				style={[
					styles.container,
					{ width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor },
				]}
			/>
		)
	}

	// `String(node)` on an element yields `[object Object]`, so only a string or a number becomes the
	// accessible name; anything else is rendered as given and labelled by the caller.
	const spokenLabel = typeof content === 'string' || typeof content === 'number' ? String(content) : undefined
	const fontSize = labelSizeFor(size)
	// The label is measured against the fill it actually sits on. It used to be `colors.white`
	// unconditionally against `colors.primary`, which is legible for two of the three tenants and not
	// for a pale brand token — and nothing fails when it is not, the count simply disappears.
	const foreground = preferredForeground(backgroundColor, String(colors.white), String(colors.text))

	return (
		<View
			testID={testID}
			accessibilityLabel={accessibilityLabel ?? spokenLabel}
			style={[
				styles.container,
				styles.badge,
				{
					height: size,
					minWidth: size,
					borderRadius: size / 2,
					// A count wider than the circle grows into a pill rather than being clipped. The
					// padding is proportional so a 34pt badge does not wear a 20pt badge's margins.
					paddingHorizontal: Math.round(size * 0.2),
					backgroundColor,
				},
			]}>
			<Text
				numberOfLines={1}
				style={[
					styles.label,
					{
						color: foreground,
						fontSize,
						// The app's own face. Paper's badge set none, so every count in the product rendered
						// in the system font beside labels that did not.
						fontFamily: fonts.regular,
						fontWeight: '600',
						// Close to the face's natural line height, so the text box is barely taller than the
						// glyphs and the flex centring above has almost nothing left to correct. Digits carry
						// no descender, so their optical centre sits slightly above their box centre; the
						// nudge below is the whole of that correction, in one place.
						lineHeight: Math.round(fontSize * 1.2),
						marginTop: Math.round(fontSize * 0.08),
					},
				]}>
				{content}
			</Text>
		</View>
	)
}
