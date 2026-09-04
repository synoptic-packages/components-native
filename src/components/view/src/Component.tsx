import { ErrorBoundary } from '../../error-boundary/index'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import type { TGeneric } from '../../../types'
import { resolveColor } from '../../../utils/resolveColor'
import React from 'react'
import { ViewProps as ViewPropsRN, View as ViewRN, ViewStyle, type Falsy, type RecursiveArray } from 'react-native'

export type ViewProps = ViewPropsRN &
	ViewStyle & {
		backgroundColor?: ColorName | string
		borderColor?: ColorName | string
		outlineColor?: ColorName | string
		outlineWidth?: number
		outlineOffset?: number
		transparent?: boolean
		flexCenter?: boolean
		style?: (ViewStyle | Falsy | RecursiveArray<ViewStyle | Falsy> | readonly (ViewStyle | Falsy)[] | TGeneric) &
			ViewStyle
		keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
		elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
	}

export type ComponentProps = ViewProps

export const Native: React.FC<ComponentProps> = (props) => {
	const { colors } = useTheme()
	const {
		style,
		children,
		borderColor,
		outlineColor,
		outlineWidth,
		outlineOffset,
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
		<ViewRN
			{...remainingProps}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
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
					...(outlineColor && {
						outlineColor: resolveColor(outlineColor, colors),
					}),
					...(outlineWidth !== undefined && {
						outlineWidth,
					}),
					...(outlineOffset !== undefined && {
						outlineOffset,
					}),
					...(backgroundColor && { backgroundColor: resolveColor(backgroundColor, colors) }),
					...(flexCenter && { justifyContent: 'center', alignItems: 'center' }),
					...(transparent && { backgroundColor: 'transparent' }),
					// @ts-ignore
					...(elevationLevel !== undefined ? elevation[`level${elevationLevel}`] : undefined),
				},
			]}>
			{children}
		</ViewRN>
	)
}

export const Component: React.FC<ComponentProps> = (props) => {
	return (
		<ErrorBoundary>
			<Native {...props} />
		</ErrorBoundary>
	)
}
