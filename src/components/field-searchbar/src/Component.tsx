import React, { useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput } from 'react-native'

import { Icon } from '../../icon/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { toStringOrEmpty } from '../../../lib/string'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	placeholder?: string
	autoFocus?: boolean
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	onSearch?: (_query: string) => void
	testID?: string
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder = 'Search...',
	autoFocus = false,
	control,
	rules,
	onSearch,
	testID,
}) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [isFocused, setIsFocused] = useState(false)

	const {
		field: { onChange, onBlur, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched

	const handleChangeText = (text: string) => {
		onChange(text)
		onSearch?.(text)
	}

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true} testID={testID}>
			<View style={componentStyles.searchBar}>
				<Icon
					family={`Ionicons`}
					name={`search`}
					size={20}
					color={isFocused ? 'text' : 'mutedLight'}
					style={componentStyles.iconSearch}
				/>
				<TextInput
					testID={`${testID ?? `field-${name}`}-input`}
					accessibilityLabel={label ?? placeholder}
					value={toStringOrEmpty(value)}
					onChangeText={handleChangeText}
					onBlur={() => {
						onBlur()
						setIsFocused(false)
					}}
					onFocus={() => setIsFocused(true)}
					placeholder={placeholder}
					placeholderTextColor={hasError ? colors?.error : colors?.muted}
					underlineColorAndroid={`transparent`}
					selectionColor={colors?.text}
					autoFocus={autoFocus}
					clearButtonMode={`while-editing`}
					autoCapitalize={`none`}
					autoComplete={`off`}
					autoCorrect={false}
					enterKeyHint={`search`}
					returnKeyType={`search`}
					editable={!disabled}
					style={[componentStyles.inputField, { color: hasError ? colors?.error : colors?.text }]}
				/>
				{value ? (
					<Icon
						family={`Ionicons`}
						name={`close-circle`}
						size={18}
						color={`mutedLight`}
						onPress={() => handleChangeText('')}
					/>
				) : null}
			</View>
		</FieldHelper>
	)
}
