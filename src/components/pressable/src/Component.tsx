import type { TGeneric } from '../../../types'
import React from 'react'
// Haptics is optional (published expo peer) — resolved lazily so a host that does not link
// expo-haptics still imports this component safely. Impact feedback simply does not fire there.
let Haptics: typeof import('expo-haptics') | undefined
try {
	// @ts-ignore module may be absent in some hosts
	Haptics = require('expo-haptics')
} catch {
	Haptics = undefined
}
import {
	Platform,
	Pressable as PressableRN,
	type PressableProps,
	type PressableStateCallbackType,
	type StyleProp,
	type ViewStyle,
} from 'react-native'
import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import elevation from '../../../utils/elevation'
import { resolveColor } from '../../../utils/resolveColor'

type ComponentStyle = PressableProps['style']

const isColorStyleProp = (key: string) => key === 'color' || key === 'fill' || key.endsWith('Color')

export type ComponentProps = Omit<PressableProps, 'onPress' | 'style'> &
	ViewStyle & {
		backgroundColor?: ColorName | string
		borderColor?: ColorName | string
		transparent?: boolean
		flexCenter?: boolean
		style?: ComponentStyle
		onPress?: PressableProps['onPress']
		pressOpacity?: number
		elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | number
	}

export const Component: React.FC<ComponentProps> = (props) => {
	const { colors, isDark } = useTheme()
	const {
		style,
		children,
		android_ripple,
		borderColor,
		backgroundColor,
		disabled,
		flexCenter,
		transparent,
		onPress,
		pressOpacity = 0.3,
		elevation: elevationLevel,
		...otherProps
	} = props

	const viewStyleProps: ViewStyle & TGeneric = {} as TGeneric
	const remainingProps: Omit<PressableProps, 'style'> & TGeneric = {} as TGeneric

	Object.entries(otherProps).forEach(([key, value]) => {
		if (
			key === 'width' ||
			key === 'height' ||
			key === 'minWidth' ||
			key === 'minHeight' ||
			key === 'maxWidth' ||
			key === 'maxHeight' ||
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
			key === 'gap' ||
			key === 'rowGap' ||
			key === 'columnGap'
		) {
			viewStyleProps[key] =
				typeof value === 'string' && isColorStyleProp(key) ? resolveColor(value, colors) : value
		} else {
			remainingProps[key] = value
		}
	})

	const defaultAndroidRipple = {
		color: isDark ? 'rgba(255, 255, 255, .32)' : 'rgba(0, 0, 0, .32)',
	}

	const getStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
		const passedStyle = typeof style === 'function' ? style(state) : style

		return [
			Platform.OS !== 'android' && !disabled && state.pressed && { opacity: pressOpacity },
			viewStyleProps,
			passedStyle,
			{
				...(borderColor && {
					borderBottomColor: resolveColor(borderColor, colors),
					borderTopColor: resolveColor(borderColor, colors),
					borderLeftColor: resolveColor(borderColor, colors),
					borderRightColor: resolveColor(borderColor, colors),
					borderColor: resolveColor(borderColor, colors),
				}),
				...(transparent && { backgroundColor: 'transparent' }),
				...(backgroundColor && { backgroundColor: resolveColor(backgroundColor, colors) }),
				...(flexCenter && { justifyContent: 'center', alignItems: 'center' }),
				// @ts-ignore
				...(elevationLevel !== undefined ? elevation[`level${elevationLevel}`] : undefined),
			},
		]
	}

	return (
		<PressableRN
			{...remainingProps}
			disabled={disabled}
			onPress={onPress}
			onPressIn={(ev) => {
				try {
					if (Platform.OS === 'ios' && Haptics) {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch()
					}
				} catch {
					// do nothing
				}

				props.onPressIn?.(ev)
			}}
			android_ripple={Platform.OS === 'android' && !disabled ? android_ripple || defaultAndroidRipple : undefined}
			style={getStyle}>
			{children}
		</PressableRN>
	)
}
