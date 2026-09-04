import { fonts } from '../../../theme/fonts'
import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Button as RNPaperButton, ButtonProps as RNPaperButtonProps } from 'react-native-paper'
import { useTheme } from '../../../hooks/useTheme'
import type { ThemeColors } from '../../../theme/colors'
import { TGeneric } from '../../../types'
import { sizeLabelStyles, sizeStyles } from './styles'

type ButtonVariant =
	| 'primary'
	| 'secondary'
	| 'accent'
	| 'info'
	| 'success'
	| 'warning'
	| 'error'
	| 'dark'
	| 'light'
	| 'muted'
	| 'text'

interface ComponentProps {
	mode?: 'contained' | 'outlined'
	variant?: ButtonVariant
	size?: 'small' | 'large' | 'medium'
	reverse?: boolean
	disabled?: boolean
	loading?: boolean
	onPress?: TGeneric
	style?: StyleProp<ViewStyle>
	labelStyle?: StyleProp<ViewStyle>
	children?: React.ReactNode
	width?: string | number
	testID?: string
}

function getVariantColor(variant: ButtonVariant, colors: ThemeColors): string {
	switch (variant) {
		case 'primary':
			return String(colors.primary)
		case 'secondary':
			return String(colors.secondary)
		case 'accent':
			return String(colors.accent)
		case 'info':
			return String(colors.info)
		case 'success':
			return String(colors.success)
		case 'warning':
			return String(colors.warning)
		case 'error':
			return String(colors.error)
		case 'dark':
			return String(colors.dark)
		case 'light':
			return String(colors.light)
		case 'muted':
			return String(colors.muted)
		case 'text':
			return String(colors.text)
	}
}

function getContainedTextColor(variant: ButtonVariant | undefined, colors: ThemeColors, colorScheme: string): string {
	if (!variant) {
		return colorScheme === 'dark' ? String(colors.black) : String(colors.white)
	}

	switch (variant) {
		case 'accent':
		case 'warning':
		case 'light':
			return String(colors.black)
		case 'text':
			return colorScheme === 'dark' ? String(colors.black) : String(colors.white)
		default:
			return String(colors.white)
	}
}

export const Component: React.FC<ComponentProps & RNPaperButtonProps> = ({
	mode = 'contained',
	variant,
	size = `large`,
	reverse = false,
	disabled = false,
	loading = false,
	onPress,
	children,
	style,
	labelStyle,
	width,
	...props
}) => {
	const { colors, colorScheme } = useTheme()
	let outlineBorderColor: TGeneric = null
	let buttonColor: string = String(colors.primary)
	let textColor: string = String(colors.text)
	let darkMode: boolean = mode === 'contained' || colorScheme === 'dark'
	const variantColor = variant ? getVariantColor(variant, colors) : null

	const buttonSizeStyle = size ? sizeStyles[size] : {}
	const buttonLabelStyle = size ? sizeLabelStyles[size] : {}

	if (mode === 'contained') {
		buttonColor = variantColor ?? (colorScheme === 'dark' ? String(colors.accent) : String(colors.primary))
		textColor = getContainedTextColor(variant, colors, colorScheme)
		darkMode = textColor === String(colors.white)
	} else if (mode === 'outlined') {
		buttonColor = 'transparent'
		textColor = variantColor ?? String(colors.text)
		outlineBorderColor = variantColor ?? (colorScheme === 'dark' ? String(colors.accent) : String(colors.divider))
	}

	return (
		<RNPaperButton
			mode={mode}
			dark={darkMode}
			disabled={disabled || loading}
			loading={loading}
			buttonColor={buttonColor}
			textColor={textColor}
			onPress={onPress}
			contentStyle={{ flexDirection: reverse ? 'row-reverse' : 'row' }}
			style={[
				buttonSizeStyle,
				outlineBorderColor && { borderColor: outlineBorderColor },
				style,
				width ? { width } : null,
			]}
			labelStyle={[buttonLabelStyle, labelStyle, { fontFamily: fonts.bold }]}
			{...props}>
			{children}
		</RNPaperButton>
	)
}
