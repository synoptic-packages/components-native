import { capitalize } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { OtpInput as OTPTextView } from 'react-native-otp-entry'
import { HelperText } from 'react-native-paper'

import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { toStringOrEmpty } from '../../../lib/string'
import { styles } from './styles'

interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	numberOfDigits?: number
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	onFilled?: (code: string) => void
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	numberOfDigits = 5,
	control,
	rules,
	onFilled,
}) => {
	const { colors, isDark } = useTheme()
	const [isFilled, setIsFilled] = useState(false)
	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount, handleSubmit } = useFormState({ control }) as any

	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)

	useEffect(() => {
		if (isFilled && handleSubmit) {
			handleSubmit?.()
		}
	}, [handleSubmit, isFilled])

	return (
		<View style={styles.wrapper} testID={`field-${name}`}>
			{label && (
				<HelperText type={`info`} visible={true} style={{ color: colors?.muted }} allowFontScaling={false}>
					{label}
				</HelperText>
			)}
			<OTPTextView
				numberOfDigits={numberOfDigits}
				focusColor={isDark ? colors?.accent : colors?.primary}
				autoFocus={false}
				hideStick={true}
				placeholder={`⁕`.repeat(numberOfDigits)}
				blurOnFilled={true}
				disabled={disabled}
				type={`numeric`}
				secureTextEntry={false}
				focusStickBlinkingDuration={500}
				onTextChange={(text) => onChange(text)}
				onFilled={(code) => {
					setIsFilled(true)
					onFilled?.(code)
				}}
				textInputProps={{
					// The one editable input in this field. Until this id existed, a flow could not type a
					// code into any OTP/PIN surface at all: `react-native-otp-entry` renders the digit cells
					// as Text and hides a single TextInput behind them, so there was nothing addressable.
					// `field-<name>-input` is the same contract every other single-input field follows.
					testID: `field-${name}-input`,
					accessibilityLabel: label ?? 'One-Time Password',
					value: toStringOrEmpty(value),
					enablesReturnKeyAutomatically: true,
				}}
				textProps={{
					accessibilityRole: 'text',
					accessibilityLabel: 'OTP digit',
					allowFontScaling: false,
				}}
				theme={{
					placeholderTextStyle: {
						color: colors?.mutedLight,
						fontSize: 24,
					},
					pinCodeTextStyle: {
						color: colors?.text,
						fontSize: 32,
					},
					containerStyle: {
						justifyContent: 'center',
						alignItems: 'center',
					},
					pinCodeContainerStyle: {
						width: 54,
						aspectRatio: 1,
						margin: 4,
						borderWidth: StyleSheet.hairlineWidth,
						borderRightWidth: 3,
						borderBottomWidth: 5,
						borderColor: hasError ? colors?.error : colors?.muted,
					},
				}}
			/>
			{hasError ? (
				<HelperText
					type={`error`}
					visible={true}
					style={{ textAlign: 'center', color: colors?.error }}
					allowFontScaling={false}>
					{capitalize(error?.message)}
				</HelperText>
			) : hint ? (
				<HelperText
					type={`info`}
					visible={hint.length > 0}
					style={{ textAlign: 'center', color: colors?.muted }}
					allowFontScaling={false}>
					{hint}
				</HelperText>
			) : null}
		</View>
	)
}
