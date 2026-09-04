import type { TGeneric } from '../../../types'
import React from 'react'
import {
	Platform,
	TouchableOpacityProps,
	TouchableOpacity as TouchableOpacityRN,
	ViewProps,
	ViewStyle,
} from 'react-native'
import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'

export type Props = ViewProps &
	TouchableOpacityProps &
	ViewStyle & {
		backgroundColor?: ColorName
		borderColor?: ColorName
		transparent?: boolean
		flexCenter?: boolean
		style?: ViewStyle | ViewStyle[]
		onPress?: () => void
		elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | number
	}

export type ComponentProps = Props

export const Component: React.FC<ComponentProps> = (props) => {
	const { colors } = useTheme()
	const {
		style,
		children,
		borderColor,

		backgroundColor,
		flexCenter,
		transparent,
		onPress,
		elevation: elevationLevel,
		...otherProps
	} = props

	const viewStyleProps: ViewStyle & TGeneric = {} as TGeneric
	const remainingProps: ViewProps & TGeneric = {} as TGeneric

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
			key === 'flexWrap'
		) {
			viewStyleProps[key] = value
		} else {
			remainingProps[key] = value
		}
	})

	return (
		<TouchableOpacityRN
			activeOpacity={0.4}
			{...(Platform.OS === 'android' ? { onPressOut: onPress } : { onPress })}
			{...remainingProps}
			style={[
				viewStyleProps,
				style,
				{
					...(borderColor && { borderColor: colors[borderColor] }),
					...(backgroundColor && { backgroundColor: colors[backgroundColor] }),
					...(flexCenter && { justifyContent: 'center', alignItems: 'center' }),
					...(transparent && { backgroundColor: 'transparent' }),
					// @ts-ignore
					...(elevationLevel !== undefined ? elevation[`level${elevationLevel}`] : undefined),
				},
			]}>
			{children}
		</TouchableOpacityRN>
	)
}
