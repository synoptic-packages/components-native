import React from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as TextInputNative, type TextInputProps } from 'react-native-paper'

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
	numberOfLines?: number
	maxLength?: number
	autoCapitalize?: TextInputProps['autoCapitalize']
	autoCorrect?: boolean
	rules?: ValidationRules
	control: Control<TGeneric> | TGeneric
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	control,
	placeholder,
	disabled = false,
	numberOfLines = 3,
	maxLength,
	autoCapitalize = 'sentences',
	autoCorrect = false,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<TextInputNative
				testID={`field-${name}-input`}
				mode={`flat`}
				multiline={true}
				numberOfLines={numberOfLines}
				value={typeof value === 'string' ? value : value == null ? '' : String(value)}
				onBlur={onBlur}
				onChangeText={onChange}
				placeholder={placeholder}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				maxLength={maxLength}
				disabled={disabled}
				dense={true}
				enablesReturnKeyAutomatically
				underlineColor={colors?.muted}
				activeUnderlineColor={isDark ? colors?.accent : colors?.primary}
				error={hasError}
				placeholderTextColor={hasError ? colors?.error : colors?.muted}
				textColor={hasError ? colors?.error : colors?.text}
				autoComplete={`off`}
				underlineStyle={{ height: input.borderWidth }}
				contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
				style={componentStyles.input}
			/>
		</FieldHelper>
	)
}
