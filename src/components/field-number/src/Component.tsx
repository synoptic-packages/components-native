import React, { useCallback, useState, type ReactElement } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, View } from 'react-native'
import { TextInput as TextInputNative, type TextInputProps } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	maxLength?: number
	step?: number
	minValue?: number
	maxValue?: number
	allowDecimals?: boolean
	prefix?: string
	suffix?: string
	rules?: ValidationRules
	control: Control<TGeneric> | TGeneric
	left?: React.ReactNode
	right?: React.ReactNode
}

const sanitizeNumericInput = (value: string, allowDecimals: boolean): string => {
	const cleaned = value.replace(allowDecimals ? /[^0-9.]/g : /[^0-9]/g, '')

	if (!allowDecimals) return cleaned

	const [integerPart, ...decimalParts] = cleaned.split('.')
	if (decimalParts.length === 0) return cleaned

	return `${integerPart}.${decimalParts.join('')}`
}

const clampNumber = (value: number, minValue?: number, maxValue?: number): number => {
	if (typeof minValue === 'number' && value < minValue) return minValue
	if (typeof maxValue === 'number' && value > maxValue) return maxValue
	return value
}

const formatNumberValue = (value: number, allowDecimals: boolean): string => {
	if (!allowDecimals) return String(Math.trunc(value))
	return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)))
}

const toOutputValue = (nextValue: string, currentValue: unknown): string | number => {
	if (typeof currentValue === 'number') {
		return nextValue === '' ? '' : Number(nextValue)
	}

	return nextValue
}

export const Component: React.FC<FieldComponentProps & TextInputProps> = ({
	name,
	label,
	mode = 'flat',
	hint,
	control,
	placeholder,
	disabled = false,
	maxLength,
	step = 1,
	minValue,
	maxValue,
	allowDecimals = false,
	prefix,
	suffix,
	rules,
	right,
	left,
	...props
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const [isFocused, setIsFocused] = useState(false)

	const hasError = Boolean(error?.message) && isTouched
	const resolvedValue = typeof value === 'string' ? value : value == null ? '' : String(value)
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	const handleChangeText = useCallback(
		(text: string) => {
			const nextValue = sanitizeNumericInput(text, allowDecimals)
			onChange(toOutputValue(nextValue, value))
		},
		[allowDecimals, onChange, value]
	)

	const handleStepChange = useCallback(
		(direction: 1 | -1) => {
			const currentNumber = Number.parseFloat(resolvedValue || '0')
			const safeCurrentNumber = Number.isNaN(currentNumber) ? 0 : currentNumber
			const nextNumber = clampNumber(safeCurrentNumber + direction * step, minValue, maxValue)
			const nextValue = formatNumberValue(nextNumber, allowDecimals)

			onChange(toOutputValue(nextValue, value))
		},
		[allowDecimals, maxValue, minValue, onChange, resolvedValue, step, value]
	)

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<TextInputNative
				mode={mode}
				value={resolvedValue}
				placeholder={placeholder}
				disabled={disabled}
				outlineColor={isFocused ? activeColor : String(colors.divider)}
				activeOutlineColor={activeColor}
				dense={true}
				enablesReturnKeyAutomatically
				underlineColor={hasError ? activeColor : isFocused ? activeColor : colors?.muted}
				activeUnderlineColor={activeColor}
				error={hasError}
				placeholderTextColor={hasError ? colors?.error : colors?.muted}
				textColor={hasError ? colors?.error : colors?.text}
				underlineStyle={{ height: input.borderWidth }}
				contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
				style={componentStyles.input}
				render={(inputProps) => (
					<View style={componentStyles.inputContent}>
						{left && React.isValidElement(left) ? (
							React.cloneElement(left as ReactElement<{ style?: any }>, {
								style: [
									(left as ReactElement<{ style?: any }>).props?.style ?? {},
									componentStyles.stepIconLeftCustom,
								],
							})
						) : !left ? (
							<Pressable
								style={componentStyles.stepButtonLeft}
								onPress={disabled ? undefined : () => handleStepChange(-1)}>
								<Icon
									family={`MaterialCommunityIcons`}
									name={`minus`}
									size={20}
									color={hasError ? colors?.error : colors?.muted}
									style={disabled ? componentStyles.stepIconDisabled : null}
								/>
							</Pressable>
						) : null}
						{prefix ? (
							<Text
								variant={`bodyMedium`}
								color={disabled ? `muted` : `muted`}
								style={componentStyles.prefixText}>
								{prefix}
							</Text>
						) : null}
						<InputNative
							{...inputProps}
							testID={`field-${name}-input`}
							value={resolvedValue}
							onBlur={(event) => {
								inputProps.onBlur?.(event)
								onBlur()
								setIsFocused(false)
							}}
							onFocus={(event) => {
								inputProps.onFocus?.(event)
								setIsFocused(true)
							}}
							onChangeText={handleChangeText}
							placeholder={placeholder}
							keyboardType={allowDecimals ? 'decimal-pad' : 'numeric'}
							autoCapitalize={`none`}
							autoCorrect={false}
							maxLength={maxLength}
							autoComplete={`off`}
							editable={!disabled}
							style={[
								inputProps.style,
								componentStyles.nativeInput,
								{ color: hasError ? colors?.error : colors?.text },
							]}
						/>
						{suffix ? (
							<Text
								variant={`bodyMedium`}
								color={disabled ? `muted` : `muted`}
								style={componentStyles.suffixText}>
								{suffix}
							</Text>
						) : null}
						{right && React.isValidElement(right) ? (
							React.cloneElement(right as ReactElement<{ style?: any }>, {
								style: [
									(right as ReactElement<{ style?: any }>).props?.style ?? {},
									componentStyles.stepIconRightCustom,
								],
							})
						) : (
							<Pressable
								style={componentStyles.stepButtonRight}
								onPress={disabled ? undefined : () => handleStepChange(1)}>
								<Icon
									family={`MaterialCommunityIcons`}
									name={`plus`}
									size={20}
									color={hasError ? colors?.error : colors?.muted}
									style={disabled ? componentStyles.stepIconDisabled : null}
								/>
							</Pressable>
						)}
					</View>
				)}
				{...props}
			/>
		</FieldHelper>
	)
}
