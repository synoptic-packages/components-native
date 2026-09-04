import type { ColorName } from '../../../theme/colors'
import { fonts } from '../../../theme/fonts'
import type { AppTextVariant } from '../../../theme/theme'
import { displayLetterSpacing, isDisplayFaceVariant } from '../../../theme/typography'
import type { TGeneric } from '../../../types'
import { resolveColor } from '../../../utils/resolveColor'
import React from 'react'
import { DimensionValue, TextStyle } from 'react-native'
import { Text as RNText, TextProps as RNTextProps } from 'react-native-paper'
import { useTheme } from '../../../hooks/useTheme'
import { TouchableOpacity } from '../../touchable-opacity'

interface StyleProps {
	fontSize?: number
	fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
	fontStyle?: 'normal' | 'italic'
	fontFamily?: keyof typeof fonts
	lineHeight?: number
	letterSpacing?: number
	textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
	textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through'
	textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed'
	textDecorationColor?: string
	textShadowColor?: string
	textShadowOffset?: { width: number; height: number }
	textShadowRadius?: number
	textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
	includeFontPadding?: boolean
	writingDirection?: 'auto' | 'ltr' | 'rtl'

	/**
	 * Layout properties
	 */
	width?: DimensionValue
	height?: DimensionValue
	margin?: DimensionValue
	marginTop?: DimensionValue
	marginRight?: DimensionValue
	marginBottom?: DimensionValue
	marginLeft?: DimensionValue
	marginHorizontal?: DimensionValue
	marginVertical?: DimensionValue
	padding?: DimensionValue
	paddingTop?: DimensionValue
	paddingRight?: DimensionValue
	paddingBottom?: DimensionValue
	paddingLeft?: DimensionValue
	paddingHorizontal?: DimensionValue
	paddingVertical?: DimensionValue
	borderRadius?: number
	position?: 'absolute' | 'relative'
	top?: DimensionValue
	right?: DimensionValue
	bottom?: DimensionValue
	left?: DimensionValue
	flex?: number
	flexGrow?: number
	flexShrink?: number
	flexBasis?: DimensionValue
	alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
	zIndex?: number

	// Background properties
	backgroundColor?: ColorName | string
}

interface ComponentProps extends Omit<RNTextProps<AppTextVariant>, 'style'>, StyleProps {
	color?: ColorName | string
	size?: number
	bold?: boolean
	italic?: boolean
	underline?: boolean
	opacity?: number
	align?: 'left' | 'right' | 'center'
	style?: TextStyle | TextStyle[]
	onPress?: () => void
}

export const Component: React.FC<ComponentProps> = ({
	color = 'text',
	size,
	fontSize,
	bold,
	italic,
	underline,
	fontFamily,
	align,
	style,
	opacity,
	onPress,
	children = '',
	// Extract style props
	width,
	height,
	margin,
	marginTop,
	marginRight,
	marginBottom,
	marginLeft,
	marginHorizontal,
	marginVertical,
	padding,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
	paddingHorizontal,
	paddingVertical,
	borderRadius,
	position,
	top,
	right,
	bottom,
	left,
	flex,
	flexGrow,
	flexShrink,
	flexBasis,
	alignSelf,
	zIndex,
	lineHeight,
	letterSpacing,
	textAlign,
	textDecorationStyle,
	textDecorationColor,
	textShadowColor,
	textShadowOffset,
	textShadowRadius,
	textTransform,
	includeFontPadding,
	writingDirection,
	backgroundColor,
	...otherProps
}) => {
	const { colors } = useTheme()

	const textStyleProps: TextStyle & TGeneric = {} as TGeneric
	const remainingProps: RNTextProps<AppTextVariant> & TGeneric = {} as TGeneric

	Object.entries(otherProps).forEach(([key, value]) => {
		if (
			key === 'fontSize' ||
			key === 'fontWeight' ||
			key === 'fontStyle' ||
			key === 'fontFamily' ||
			key === 'lineHeight' ||
			key === 'letterSpacing' ||
			key === 'textAlign' ||
			key === 'textDecorationLine' ||
			key === 'textDecorationStyle' ||
			key === 'textDecorationColor' ||
			key === 'textShadowColor' ||
			key === 'textShadowOffset' ||
			key === 'textShadowRadius' ||
			key === 'textTransform' ||
			key === 'includeFontPadding' ||
			key === 'writingDirection' ||
			key === 'color' ||
			key === 'opacity' ||
			key === 'width' ||
			key === 'height' ||
			key === 'margin' ||
			key === 'padding' ||
			key === 'borderRadius' ||
			key === 'position' ||
			key === 'top' ||
			key === 'right' ||
			key === 'bottom' ||
			key === 'left' ||
			key === 'flex' ||
			key === 'zIndex' ||
			key.startsWith('margin') ||
			key.startsWith('padding') ||
			key.startsWith('border') ||
			key.startsWith('flex') ||
			key === 'alignSelf' ||
			key === 'background' ||
			key === 'backgroundColor'
		) {
			textStyleProps[key] = value
		} else {
			remainingProps[key] = value
		}
	})

	// @ts-ignore
	let resolvedFontFamily: keyof typeof fonts =
		fontFamily || (bold ? 'bold' : italic ? 'italic' : onPress ? 'bold' : undefined)

	if (bold || onPress) {
		resolvedFontFamily = 'bold'
	} else if (italic) {
		resolvedFontFamily = 'italic'
	}

	const propStyles: TextStyle = {
		...(width !== undefined && { width }),
		...(height !== undefined && { height }),
		...(margin !== undefined && { margin }),
		...(marginTop !== undefined && { marginTop }),
		...(marginRight !== undefined && { marginRight }),
		...(marginBottom !== undefined && { marginBottom }),
		...(marginLeft !== undefined && { marginLeft }),
		...(marginHorizontal !== undefined && { marginHorizontal }),
		...(marginVertical !== undefined && { marginVertical }),
		...(padding !== undefined && { padding }),
		...(paddingTop !== undefined && { paddingTop }),
		...(paddingRight !== undefined && { paddingRight }),
		...(paddingBottom !== undefined && { paddingBottom }),
		...(paddingLeft !== undefined && { paddingLeft }),
		...(paddingHorizontal !== undefined && { paddingHorizontal }),
		...(paddingVertical !== undefined && { paddingVertical }),
		...(borderRadius !== undefined && { borderRadius }),
		...(position !== undefined && { position }),
		...(top !== undefined && { top }),
		...(right !== undefined && { right }),
		...(bottom !== undefined && { bottom }),
		...(left !== undefined && { left }),
		...(flex !== undefined && { flex }),
		...(flexGrow !== undefined && { flexGrow }),
		...(flexShrink !== undefined && { flexShrink }),
		...(flexBasis !== undefined && { flexBasis }),
		...(alignSelf !== undefined && { alignSelf }),
		...(zIndex !== undefined && { zIndex }),
		...(lineHeight !== undefined && { lineHeight }),
		...(letterSpacing !== undefined && { letterSpacing }),
		...(textAlign !== undefined && { textAlign }),
		...(textDecorationStyle !== undefined && { textDecorationStyle }),
		...(textDecorationColor !== undefined && { textDecorationColor }),
		...(textShadowColor !== undefined && { textShadowColor }),
		...(textShadowOffset !== undefined && { textShadowOffset }),
		...(textShadowRadius !== undefined && { textShadowRadius }),
		...(textTransform !== undefined && { textTransform }),
		...(includeFontPadding !== undefined && { includeFontPadding }),
		...(writingDirection !== undefined && { writingDirection }),
		...(backgroundColor !== undefined && { backgroundColor: resolveColor(backgroundColor, colors) }),
	}

	// Tracking for text set in the DISPLAY face at a size the THEME did not choose.
	//
	// The Paper variants already carry tracking derived from their own size (see `displayFaceVariant`
	// in the theme), and that is right until a caller changes the size underneath it: `variant="titleLarge"
	// fontSize={30}` would otherwise render 30pt type wearing the tracking computed for 22pt. The same
	// hole existed for `fontFamily="display"` with no variant at all — the display face at an arbitrary
	// size and no tracking whatsoever, which is how a hand-tuned `letterSpacing={-0.4}` ended up in a
	// product banner.
	//
	// Only fires when the size is known HERE. With no explicit size the variant's own value is already
	// correct and must not be recomputed. An explicit `letterSpacing` prop is the escape hatch and must
	// win — and it is checked HERE rather than left to style precedence, because `textStyle` is applied
	// AFTER `propStyles` in the style array below, so a derived value would otherwise silently beat the
	// caller's own.
	const effectiveFontSize = size ?? fontSize
	const rendersDisplayFace = resolvedFontFamily === 'display' || isDisplayFaceVariant(remainingProps.variant)
	const derivedLetterSpacing =
		letterSpacing === undefined && effectiveFontSize !== undefined && rendersDisplayFace
			? displayLetterSpacing(effectiveFontSize)
			: undefined

	const textStyle: TextStyle = {
		...((size || fontSize) && { fontSize: size || fontSize }),
		...(derivedLetterSpacing !== undefined && { letterSpacing: derivedLetterSpacing }),
		...(opacity && { opacity }),
		...(align && { textAlign: align }),
		...(resolvedFontFamily && { fontFamily: fonts[resolvedFontFamily] }),
		textDecorationLine: (!underline && onPress) || underline ? 'underline' : 'none',
		...(color && { color: resolveColor(color, colors) }),
	}

	function RNTextRender() {
		return (
			<RNText style={[propStyles, textStyleProps, textStyle, style]} {...remainingProps}>
				{children}
			</RNText>
		)
	}

	return onPress ? (
		<TouchableOpacity onPress={onPress}>
			<RNTextRender />
		</TouchableOpacity>
	) : (
		<RNTextRender />
	)
}
