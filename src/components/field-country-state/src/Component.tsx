import type { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, StyleSheet } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { toStringOrEmpty } from '../../../lib/string'
import { useCountry } from '../../../hooks/useCountry'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	label?: string
	hint?: string
	country: CountryCode | string
	disabled?: boolean
	placeholder?: string
	onChange?: (_value: TGeneric) => void
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	country,
	disabled = false,
	placeholder,
	onChange: onValueChange,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const { getCountryByCode } = useCountry()
	const [modalVisible, setModalVisible] = useState(false)

	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched
	const selectedCountry = useMemo(() => {
		return country ? getCountryByCode(String(country).toUpperCase() as CountryCode) : undefined
	}, [country, getCountryByCode])
	const options = useMemo(() => {
		return (selectedCountry?.states ?? []).map((state) => ({
			label: state,
			value: state,
		}))
	}, [selectedCountry])
	const selected = options.find((option) => option.value === value)
	const resolvedPlaceholder = placeholder ?? (options.length > 0 ? 'Select state' : 'Enter state')

	const handleChange = useCallback(
		(nextValue: TGeneric) => {
			if (typeof onValueChange === 'function') {
				onValueChange(nextValue)
				return
			}

			onChange(nextValue)
		},
		[onChange, onValueChange]
	)

	useEffect(() => {
		if (options.length === 0) {
			return
		}

		if (!value || !options.some((option) => option.value === value)) {
			handleChange(options[0]?.value)
		}
	}, [handleChange, options, value])

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				{options.length > 0 ? (
					<TextInputNative
						mode={`flat`}
						value={selected?.label ?? ''}
						placeholder={resolvedPlaceholder}
						editable={false}
						dense={true}
						disabled={disabled}
						underlineColor={hasError ? colors?.error : colors?.muted}
						activeUnderlineColor={isDark ? colors?.accent : colors?.primary}
						error={hasError}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						textColor={hasError ? colors?.error : colors?.text}
						underlineStyle={{ height: input.borderWidth }}
						contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
						style={componentStyles.input}
						render={(inputProps) => (
							<Pressable
								style={componentStyles.inputContent}
								onPress={disabled ? undefined : () => setModalVisible(true)}>
								<InputNative
									{...inputProps}
									editable={false}
									pointerEvents={`none`}
									style={[
										inputProps.style,
										StyleSheet.flatten(componentStyles.nativeInput),
										{ color: hasError ? colors?.error : colors?.text },
									]}
								/>
								<Icon
									family={`MaterialCommunityIcons`}
									name={`chevron-down`}
									size={22}
									color={hasError ? colors?.error : colors?.muted}
									style={[
										componentStyles.chevronIcon,
										disabled ? componentStyles.chevronIconDisabled : null,
									]}
								/>
							</Pressable>
						)}
					/>
				) : (
					<TextInputNative
						mode={`flat`}
						value={toStringOrEmpty(value)}
						placeholder={resolvedPlaceholder}
						dense={true}
						disabled={disabled}
						underlineColor={hasError ? colors?.error : colors?.muted}
						activeUnderlineColor={isDark ? colors?.accent : colors?.primary}
						error={hasError}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						textColor={hasError ? colors?.error : colors?.text}
						underlineStyle={{ height: input.borderWidth }}
						contentStyle={componentStyles.contentStyle}
						style={componentStyles.input}
						onChangeText={handleChange}
					/>
				)}
			</FieldHelper>

			<ModalFormField
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				options={options}
				onSelect={(item: TGeneric) => handleChange(item.value)}>
				{null}
			</ModalFormField>
		</>
	)
}
