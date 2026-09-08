import { Flag } from '@synotech/flags'
import { AsYouType, getExampleNumber, type CountryCode } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import React, { useCallback, useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, StyleSheet } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'

import { TGeneric, ValidationRules } from '../../../types'
import { phoneNumberGetInternationalString } from '../../../lib/phone'
import { useCountry } from '../../../hooks/useCountry'

import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	placeholder?: string
	defaultCountryCode?: string
	/** Edge-geo default country (the app reads this from its store); falls back to `defaultCountryCode`. */
	geoCountryCode?: string
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

const normalizeInternationalPhoneNumber = (value?: string) => {
	if (!value) {
		return undefined
	}

	const normalizedValue = value.replace(/[^\d+]/g, '')

	return normalizedValue.startsWith('+') && normalizedValue.length > 1 ? normalizedValue : undefined
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder,
	defaultCountryCode,
	geoCountryCode,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const { options } = useCountry()
	const [modalVisible, setModalVisible] = useState(false)
	const [isFocused, setIsFocused] = useState(false)

	const {
		field: { onChange, onBlur, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const selectedCountryCode = useMemo(() => {
		if (typeof value?.countryCode === 'string' && value.countryCode.trim()) {
			return value.countryCode.toUpperCase()
		}

		return defaultCountryCode?.toUpperCase() || geoCountryCode?.toUpperCase()
	}, [defaultCountryCode, value?.countryCode, geoCountryCode])

	const country = options.find((c) => c.value?.toUpperCase() === selectedCountryCode)
	const examplePhoneNumber = useMemo(
		() => getExampleNumber(selectedCountryCode as CountryCode, examples),
		[selectedCountryCode]
	)
	const resolvedPlaceholder = examplePhoneNumber?.formatNational() ?? placeholder

	const displayValue = useMemo(() => {
		if (typeof value?.raw === 'string' && value.raw.trim()) {
			return value.raw
		}

		if (typeof value?.phoneNumber === 'string' && value.phoneNumber.trim()) {
			return new AsYouType(selectedCountryCode as CountryCode).input(value.phoneNumber)
		}

		return ''
	}, [selectedCountryCode, value?.phoneNumber, value?.raw])
	const hasError = Boolean(error?.message) && isTouched
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	const handleChangeText = useCallback(
		(text: string) => {
			const formattedInput = new AsYouType(selectedCountryCode as CountryCode).input(text)
			const formattedPhoneNumber = phoneNumberGetInternationalString({
				national: formattedInput,
				countryCode: selectedCountryCode,
			})
			const nationalFormatted = formattedPhoneNumber?.national ?? formattedInput
			const phoneNumber = nationalFormatted.replace(/\D/g, '')

			onChange({
				countryCode: selectedCountryCode,
				phoneNumber,
				phoneNumberInternational: normalizeInternationalPhoneNumber(formattedPhoneNumber?.international),
				raw: nationalFormatted,
			})
		},
		[onChange, selectedCountryCode]
	)

	const handleSelectCountry = useCallback(
		(item: TGeneric) => {
			const nextCountryCode = String(item.value).toUpperCase()
			const rawDigits =
				typeof value?.phoneNumber === 'string'
					? value.phoneNumber
					: typeof value?.raw === 'string'
						? value.raw.replace(/\D/g, '')
						: ''
			const nextDisplayValue = rawDigits ? new AsYouType(nextCountryCode as CountryCode).input(rawDigits) : ''
			const formattedPhoneNumber = phoneNumberGetInternationalString({
				national: nextDisplayValue || rawDigits,
				countryCode: nextCountryCode,
			})
			const phoneNumber = (formattedPhoneNumber?.national ?? nextDisplayValue).replace(/\D/g, '')

			onChange({
				countryCode: nextCountryCode,
				phoneNumber,
				phoneNumberInternational: normalizeInternationalPhoneNumber(formattedPhoneNumber?.international),
				raw: formattedPhoneNumber?.national ?? nextDisplayValue,
			})
			setModalVisible(false)
		},
		[onChange, value?.phoneNumber, value?.raw]
	)

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				<TextInputNative
					mode={`flat`}
					value={displayValue}
					placeholder={resolvedPlaceholder}
					keyboardType={`numeric`}
					autoCapitalize={`none`}
					autoCorrect={false}
					autoComplete={`off`}
					dense={true}
					disabled={disabled || modalVisible}
					underlineColor={hasError ? activeColor : isFocused ? activeColor : colors?.muted}
					activeUnderlineColor={activeColor}
					error={hasError}
					placeholderTextColor={hasError ? colors?.error : colors?.muted}
					textColor={hasError ? colors?.error : colors?.text}
					enablesReturnKeyAutomatically
					underlineStyle={{ height: input.borderWidth }}
					contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
					style={componentStyles.input}
					render={(inputProps) => (
						<View style={componentStyles.inputContent}>
							<Pressable style={componentStyles.countryButton} onPress={() => setModalVisible(true)}>
								<View style={componentStyles.flagWrap}>
									{selectedCountryCode ? (
										<Flag code={selectedCountryCode.toLowerCase()} size={24} />
									) : (
										<Icon
											family={`MaterialCommunityIcons`}
											name={`earth`}
											size={24}
											color={hasError ? colors?.error : colors?.muted}
										/>
									)}
								</View>
								<Text
									variant={`bodyMedium`}
									color={hasError ? `error` : `text`}
									style={componentStyles.countryCode}>
									{`+${country?.callingCode ?? ''}`}
								</Text>
							</Pressable>
							<InputNative
								{...inputProps}
								testID={`field-${name}-input`}
								keyboardType={`numeric`}
								placeholder={resolvedPlaceholder}
								placeholderTextColor={colors?.muted}
								value={displayValue}
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
								style={[
									inputProps.style,
									{ flex: 1, color: hasError ? colors?.error : colors?.text },
									StyleSheet.flatten(componentStyles.nativeInput),
								]}
							/>
							<Icon
								family={`Lucide`}
								name={`Phone`}
								size={20}
								color={hasError ? colors?.error : colors?.muted}
								style={componentStyles.inputIcon}
							/>
						</View>
					)}
				/>
			</FieldHelper>

			<ModalFormField
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				template={`country`}
				options={options}
				onSelect={handleSelectCountry as any}>
				{null}
			</ModalFormField>
		</>
	)
}
