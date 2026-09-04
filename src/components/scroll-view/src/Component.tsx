import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import type { TGeneric } from '../../../types'
import elevation from '../../../utils/elevation'
import { resolveColor } from '../../../utils/resolveColor'
import React from 'react'
import { ScrollView as ScrollViewRN, type ScrollViewProps as ScrollViewPropsRN, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type ScrollViewProps = ScrollViewPropsRN &
	ViewStyle & {
		backgroundColor?: ColorName | string
		borderColor?: ColorName | string
		transparent?: boolean
		flexCenter?: boolean
		style?: ViewStyle | ViewStyle[]
		safeArea?: boolean
		contentContainerStyle?: ViewStyle | ViewStyle[]
		elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | number
	}

export type ComponentProps = ScrollViewProps

export const Component = React.forwardRef<ScrollViewRN, ComponentProps>((props, ref) => {
	const { colors } = useTheme()
	const { bottom, top } = useSafeAreaInsets()
	const bottomPadding = bottom + 20
	const {
		style,
		children,
		borderColor,
		backgroundColor = colors?.bg,
		flexCenter,
		transparent,
		elevation: elevationLevel,
		contentContainerStyle,
		safeArea,
		// Default so taps on interactive children (suggestion rows, list items, buttons) fire while a
		// keyboard is up, instead of the first tap only dismissing the keyboard. Empty-area taps still
		// dismiss. Callers can override per screen.
		keyboardShouldPersistTaps = 'handled',
		...otherProps
	} = props

	const viewStyleProps: ViewStyle & TGeneric = {} as TGeneric
	const remainingProps: ScrollViewPropsRN & TGeneric = {} as TGeneric

	Object.entries(otherProps).forEach(([key, value]) => {
		if (
			key === 'width' ||
			key === 'height' ||
			key === 'padding' ||
			key === 'margin' ||
			key === 'flex' ||
			key === 'borderRadius' ||
			key === 'position' ||
			key === 'top' ||
			key === 'right' ||
			key === 'bottom' ||
			key === 'left' ||
			key.startsWith('padding') ||
			key.startsWith('margin') ||
			key.startsWith('border') ||
			key.startsWith('flex') ||
			key === 'opacity' ||
			key === 'zIndex' ||
			key === 'justifyContent' ||
			key === 'alignItems' ||
			key === 'alignSelf' ||
			key === 'alignContent' ||
			key === 'flexDirection' ||
			key === 'flexWrap' ||
			key === 'gap'
		) {
			viewStyleProps[key] = value
		} else {
			remainingProps[key] = value
		}
	})

	return (
		<ScrollViewRN
			ref={ref}
			{...remainingProps}
			style={[
				viewStyleProps,
				style,
				{
					...(borderColor && {
						borderBottomColor: resolveColor(borderColor, colors),
						borderTopColor: resolveColor(borderColor, colors),
						borderLeftColor: resolveColor(borderColor, colors),
						borderRightColor: resolveColor(borderColor, colors),
						borderColor: resolveColor(borderColor, colors),
					}),
					...(backgroundColor && { backgroundColor: resolveColor(backgroundColor, colors) }),
					...(flexCenter && { justifyContent: 'center', alignItems: 'center' }),
					...(transparent && { backgroundColor: 'transparent' }),
					...(safeArea && { paddingTop: top }),
					// @ts-ignore
					...(elevationLevel !== undefined ? elevation[`level${elevationLevel}`] : undefined),
				},
			]}
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			contentContainerStyle={contentContainerStyle}>
			{children}
			{/*
			 * The trailing spacer clears the home indicator so the last row of a VERTICAL scroll is not
			 * sitting under it. On a HORIZONTAL scroll it is not a bottom inset at all — it becomes one
			 * more item in the row, a full screen wide, so the strip scrolls on into an empty region
			 * past its last chip and the scroll position no longer means what it looks like. A
			 * horizontal scroller has no bottom edge of its own to clear; whatever is beneath it owns
			 * that inset.
			 */}
			{props.horizontal ? null : <View height={bottomPadding} minHeight={bottomPadding} width={`100%`} />}
		</ScrollViewRN>
	)
})

Component.displayName = 'ScrollView'
