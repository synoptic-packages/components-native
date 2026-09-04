import { Icon } from '../../icon/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import React, { useState, type ReactElement } from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { TextInput as InputNative, View } from 'react-native'
import { TextInput as TextInputNative, type TextInputProps } from 'react-native-paper'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	keyboardType?: TextInputProps['keyboardType']
	autoCapitalize?: TextInputProps['autoCapitalize']
	autoCorrect?: boolean
	maxLength?: number
	type?: 'text' | 'email' | 'password'
	rules?: ValidationRules
	control: Control<TGeneric> | TGeneric
	left?: React.ReactNode
	right?: React.ReactNode
}

export const Component: React.FC<FieldComponentProps & TextInputProps> = ({
	name,
	label,
	mode = 'flat',
	hint,
	control,
	placeholder,
	disabled = false,
	keyboardType,
	autoCapitalize,
	autoCorrect = false,
	type = 'text',
	rules,
	maxLength,
	right,
	left,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })
	const [isFocused, setIsFocused] = useState(false)
	const [showPassword, setShowPassword] = useState(type === 'password')
	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const resolvedKeyboardType = keyboardType ?? (type === 'email' ? 'email-address' : 'default')
	const resolvedAutoCapitalize = autoCapitalize ?? (type === 'email' ? 'none' : 'sentences')
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<TextInputNative
				mode={mode}
				value={typeof value === 'string' ? value : value == null ? '' : String(value)}
				placeholder={placeholder}
				disabled={disabled}
				secureTextEntry={type === 'password' && !showPassword}
				outlineColor={isFocused ? activeColor : String(colors.divider)}
				activeOutlineColor={activeColor}
				dense={true}
				enablesReturnKeyAutomatically
				underlineColor={isFocused ? activeColor : colors?.muted}
				activeUnderlineColor={activeColor}
				error={Boolean(error && isTouched)}
				placeholderTextColor={error && isTouched ? colors?.error : colors?.muted}
				textColor={error && isTouched ? colors?.error : colors?.text}
				autoComplete={`off`}
				underlineStyle={{ height: input.borderWidth }}
				contentStyle={[
					{
						paddingLeft: 0,
						paddingRight: 0,
						backgroundColor: `transparent`,
					},
				]}
				style={componentStyles.input}
				render={(inputProps) => (
					<View style={componentStyles.inputContent}>
						{left && React.isValidElement(left)
							? React.cloneElement(left as ReactElement<{ style?: any }>, {
									style: [
										(left as ReactElement<{ style?: any }>).props?.style ?? {},
										componentStyles.leftAdornment,
									],
								})
							: null}
						<InputNative
							{...inputProps}
							testID={`field-${name}-input`}
							value={typeof value === 'string' ? value : value == null ? '' : String(value)}
							onBlur={(event) => {
								inputProps.onBlur?.(event)
								onBlur()
								setIsFocused(false)
							}}
							onFocus={(event) => {
								inputProps.onFocus?.(event)
								setIsFocused(true)
							}}
							onChangeText={onChange}
							placeholder={placeholder}
							keyboardType={resolvedKeyboardType}
							autoCapitalize={resolvedAutoCapitalize}
							autoCorrect={autoCorrect}
							maxLength={maxLength}
							editable={!disabled}
							secureTextEntry={type === 'password' && !showPassword}
							autoComplete={`off`}
							style={[
								inputProps.style,
								componentStyles.nativeInput,
								{ color: error && isTouched ? colors?.error : colors?.text },
							]}
						/>
						{type === 'password' ? (
							<Icon
								family={`Lucide`}
								name={showPassword ? 'EyeOff' : 'Eye'}
								size={20}
								color={error && isTouched ? colors?.error : colors?.muted}
								onPress={() => setShowPassword(!showPassword)}
								backgroundStyle={componentStyles.rightIconButton}
							/>
						) : type === 'email' ? (
							<Icon
								family={`Lucide`}
								name={`Mail`}
								size={20}
								color={error && isTouched ? colors?.error : colors?.muted}
								style={componentStyles.rightIcon}
							/>
						) : right && React.isValidElement(right) ? (
							React.cloneElement(right as ReactElement<{ style?: any }>, {
								style: [
									(right as ReactElement<{ style?: any }>).props?.style ?? {},
									componentStyles.rightAdornment,
								],
							})
						) : null}
					</View>
				)}
			/>
		</FieldHelper>
	)
}
