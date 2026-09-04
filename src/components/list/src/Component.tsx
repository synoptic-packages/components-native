import { useTheme } from '../../../hooks/useTheme'
import type { AppTextVariant } from '../../../theme/theme'
import React, { ReactNode } from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { Icon } from '../../icon'
import { Text } from '../../text'
import { View } from '../../view'
import { CONTAINER_HORIZONTAL_PADDING, LEFT_CONTENT_GAP, LEFT_CONTENT_SIZE, getDividerStyle, styles } from './styles'

export interface ComponentProps {
	left?: ReactNode
	title?: string | undefined | ''
	titleVariant?: AppTextVariant
	subTitle?: ReactNode
	right?: ReactNode
	height?: number
	onPress?: () => void
	isLast?: boolean
	insetDivider?: boolean
	disabled?: boolean
	style?: StyleProp<ViewStyle>
	contentStyle?: StyleProp<ViewStyle>
	rightAlign?: 'center' | 'end'
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({
	isLast,
	left,
	title,
	titleVariant = `labelLarge`,
	subTitle,
	right,
	height = 64,
	onPress,
	insetDivider = true,
	disabled = false,
	style,
	contentStyle,
	rightAlign = 'end',
	testID,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	// The leading slot is sized by its glyph, not by the row: deriving it from `height` gave a 64px
	// row a 52px column holding a 20px icon, which pushed every title inward and opened a gap the
	// eye reads as a mis-alignment. Larger leading content (an avatar) still expands past the
	// minimum on its own.
	const leftSize = left ? LEFT_CONTENT_SIZE : 0
	const dividerLeftInset = insetDivider ? CONTAINER_HORIZONTAL_PADDING + (left ? leftSize + LEFT_CONTENT_GAP : 0) : 0

	return (
		<View
			style={style ? [componentStyles.containerWrapper, style] : componentStyles.containerWrapper}
			height={height}
			maxHeight={height}
			minHeight={height}>
			{/*
			 * The `testID` belongs on the PRESSABLE below, not on this wrapper, and the wrapper carries NO id at
			 * all.
			 *
			 * It used to sit here, so a flow could see a row, tap it, and nothing happened — the select picker's
			 * options are `ListItem`s, and `tapOn: modal-option-PIN` reported COMPLETED while the sheet stayed
			 * open, because the tap landed on a non-interactive container. Giving the wrapper a `-container`
			 * suffix instead did not help either: Maestro matches ids by REGEX, so `modal-option-PIN` still
			 * matched `modal-option-PIN-container` and still hit the wrapper first. One id, on the element that
			 * actually responds, is the only arrangement that works.
			 */}
			<Pressable
				testID={testID}
				accessibilityRole={onPress ? `button` : undefined}
				onPress={onPress}
				disabled={!onPress || disabled}
				style={[componentStyles.container, contentStyle, disabled ? componentStyles.disabled : null]}>
				{left ? (
					<View style={[componentStyles.leftContainer, { minWidth: leftSize, height }]}>{left}</View>
				) : null}
				<View style={componentStyles.middleContainer}>
					<Text variant={titleVariant} marginBottom={0} numberOfLines={1} ellipsizeMode={`tail`}>
						{title}
					</Text>
					{typeof subTitle === 'string' ? (
						<Text
							variant={`bodySmall`}
							color={`muted`}
							numberOfLines={1}
							ellipsizeMode={`tail`}
							style={componentStyles.subTitle}>
							{subTitle}
						</Text>
					) : subTitle ? (
						<View style={componentStyles.subTitle}>{subTitle}</View>
					) : null}
				</View>
				<View
					style={[
						componentStyles.rightContainer,
						rightAlign === 'center' ? componentStyles.rightContainerCentered : null,
					]}>
					{/*
					 * The chevron is DECORATION. It used to carry its own `onPress`, which made it a second touch
					 * responder nested inside the row's `Pressable` — so it competed with the row for the gesture
					 * and carved its own accessible region out of it. The practical effect was that the row read
					 * as "only the arrow is clickable", and a synthetic tap aimed at the row's centre could be
					 * swallowed entirely: the select picker's options are `ListItem`s, and their `onPress` was
					 * provably never reached (instrumented, logged nothing) while the sheet stayed open.
					 *
					 * One press target per row, spanning the whole row — the `Pressable` above already fills it
					 * (`width: '100%'`, `height: '100%'`). Hiding the chevron from assistive technology keeps the
					 * row a single node with the title as its label, instead of two competing ones.
					 */}
					<View
						style={componentStyles.rightContent}
						accessible={false}
						importantForAccessibility={`no-hide-descendants`}>
						{right ? (
							right
						) : (
							<Icon
								family={`Synotech`}
								name={`SyChevronRightSystem`}
								size={14}
								style={{ opacity: 0.6 }}
							/>
						)}
					</View>
				</View>
			</Pressable>
			{!isLast ? <View style={[componentStyles.divider, getDividerStyle(dividerLeftInset)]} /> : null}
		</View>
	)
}

Component.displayName = 'ListItem'
