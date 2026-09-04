import { Icon, type IconFamily, type IconName } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { withOpacity } from '../../../lib/color'
import React, { type ReactNode } from 'react'

export interface ComponentProps {
	/** The leading glyph, set in a `bg` circle on the slab. */
	icon: IconName
	iconFamily?: IconFamily
	/** The one status line, set in the display face. */
	title: string
	subtitle?: string
	/** Content of the translucent pill on the right — a `Money`, a count, a date. */
	trailing?: ReactNode
	/** The navigation arrow inside the pill. Defaults to true; the pill renders while `trailing` or `arrow` is set. */
	arrow?: boolean
	disabled?: boolean
	onPress?: () => void
	testID?: string
	accessibilityLabel?: string
}

/**
 * A full-width brand slab that is one big button: a `primary` card with two translucent white
 * circles bleeding off its corners (clipped by the card's own radius), a 44pt icon circle, a
 * display-face title with an optional subtitle, and a translucent pill holding the `trailing`
 * content beside a navigation arrow.
 *
 * This is the "one live thing, tap to get back to it" entry — a pending order, a settling trade, an
 * awaited payout. The recipe comes from a product home's live-job banner, where it was the only way back
 * into an operation in progress; it lives here so a second surface cannot drift from the first.
 *
 * The title carries no hand-set tracking: the shared `Text` derives `displayLetterSpacing` from
 * the font size when the display face and a size meet. The pill chrome is owned here — `trailing`
 * is content only, so every consumer's pill keeps the same radius, tint and arrow.
 */
export const Component: React.FC<ComponentProps> = ({
	icon,
	iconFamily = 'MaterialCommunityIcons',
	title,
	subtitle,
	trailing,
	arrow = true,
	disabled = false,
	onPress,
	testID,
	accessibilityLabel,
}) => {
	const { colors, isDark } = useTheme()
	const glass = (opacity: number) => withOpacity(String(colors.white), opacity)
	const showPill = trailing != null || arrow

	return (
		<Pressable
			testID={testID}
			accessibilityRole={`button`}
			accessibilityLabel={accessibilityLabel ?? [title, subtitle].filter(Boolean).join('. ')}
			onPress={onPress}
			disabled={disabled}
			pressOpacity={0.9}
			borderRadius={16}
			backgroundColor={`primary`}
			overflow={`hidden`}>
			<View
				position={`absolute`}
				top={-12}
				right={-8}
				width={84}
				height={84}
				borderRadius={42}
				backgroundColor={glass(isDark ? 0.08 : 0.14)}
			/>
			<View
				position={`absolute`}
				bottom={-24}
				left={-18}
				width={96}
				height={96}
				borderRadius={48}
				backgroundColor={glass(isDark ? 0.05 : 0.09)}
			/>
			<View
				flexDirection={`row`}
				alignItems={`center`}
				justifyContent={`space-between`}
				paddingVertical={11}
				paddingHorizontal={16}>
				<View flex={1} flexDirection={`row`} alignItems={`center`} marginRight={10}>
					<View
						width={44}
						height={44}
						borderRadius={22}
						backgroundColor={`bg`}
						alignItems={`center`}
						justifyContent={`center`}
						marginRight={12}>
						<Icon family={iconFamily} name={icon} size={24} color={`primary`} />
					</View>
					<View flex={1}>
						{/* 18, not 22. This is a STATUS line on a coloured slab, not a page heading — at 22
						    the display face fills the banner and competes with the pill beside it. Tracking
						    is deliberately absent: `Text` derives it from this size. */}
						<Text color={`white`} fontSize={18} fontFamily={`display`} numberOfLines={1}>
							{title}
						</Text>
						{subtitle ? (
							<Text color={`white`} fontSize={12} opacity={0.9} numberOfLines={1}>
								{subtitle}
							</Text>
						) : null}
					</View>
				</View>
				{showPill ? (
					<View
						flexDirection={`row`}
						alignItems={`center`}
						gap={4}
						paddingVertical={8}
						paddingHorizontal={10}
						borderRadius={999}
						backgroundColor={glass(isDark ? 0.16 : 0.24)}>
						{trailing}
						{arrow ? (
							<Icon family={`MaterialCommunityIcons`} name={`arrow-right`} size={17} color={`white`} />
						) : null}
					</View>
				) : null}
			</View>
		</Pressable>
	)
}
