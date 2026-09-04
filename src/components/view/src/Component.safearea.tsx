import type { TGeneric } from '../../../types'
import React from 'react'
import { ViewProps as ViewPropsRN, ViewStyle } from 'react-native'
import { Edges, SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context'
import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'

export type ViewProps = ViewPropsRN &
	ViewStyle & {
		background?: ColorName
		backgroundColor?: ColorName
		borderColor?: ColorName
		transparent?: boolean
		flexCenter?: boolean
		edges?: Edges
		style?: ViewStyle | ViewStyle[]
		keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
		elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | number
	}

export type ComponentProps = ViewProps

export const Component: React.FC<ComponentProps> = (props) => {
	const { colors } = useTheme()
	const {
		style,
		children,
		edges,
		borderColor,
		background,
		backgroundColor,
		flexCenter,
		transparent,
		keyboardShouldPersistTaps,
		elevation: elevationLevel,
		...otherProps
	} = props

	const viewStyleProps: ViewStyle & TGeneric = {} as TGeneric
	const remainingProps: ViewPropsRN & TGeneric = {} as TGeneric

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
		<SafeAreaViewRN
			{...remainingProps}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			edges={edges}
			style={[
				viewStyleProps,
				style,
				{
					...(borderColor && {
						borderBottomColor: colors[borderColor],
						borderTopColor: colors[borderColor],
						borderLeftColor: colors[borderColor],
						borderRightColor: colors[borderColor],
						borderColor: colors[borderColor],
					}),
					...(background && { backgroundColor: colors[background] }),
					...(backgroundColor && { backgroundColor: colors[backgroundColor] }),
					...(flexCenter && { justifyContent: 'center', alignItems: 'center' }),
					...(transparent && { backgroundColor: 'transparent' }),
					// @ts-ignore
					...(elevationLevel !== undefined ? elevation[`level${elevationLevel}`] : undefined),
				},
			]}>
			{children}
		</SafeAreaViewRN>
	)
}
