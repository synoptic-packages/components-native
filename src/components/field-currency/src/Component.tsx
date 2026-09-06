import { Flag } from '@synotech/flags'
import React, { useEffect, useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import { useCurrency } from '../../../hooks/useCurrency'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import {
	amountKeyboardFor,
	amountPlaceholderFor,
	amountScaleFor,
	clampAmountToScale,
	parseAmountText,
	sanitizeAmountText,
} from '../../../utils/currencyAmountInput'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	defaultCurrencyCode?: string
	fixedSelection?: boolean
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	// No `0.00` default. The placeholder is derived from the active currency below, because a zero-decimal
	// currency showing `0.00` advertises a precision the amount cannot hold. An explicit prop still wins.
	placeholder,
	defaultCurrencyCode,
	fixedSelection = false,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [modalVisible, setModalVisible] = useState(false)

	const { options: currencyOptions, currencyGet } = useCurrency()

	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched

	// No fallback to `defaultCurrencyCode` on the lookup. It was reachable in exactly two ways and both
	// were wrong: when `value.currencyCode` was absent the second call was byte-for-byte the first (dead
	// code), and when the value carried a code the catalogue does not know it resolved the DEFAULT
	// currency — rendering that currency's flag and code beside an amount holding a different one. An
	// unresolved currency renders as absent instead; the value keeps whatever code it actually has.
	const currentCurrencyCode: string | undefined = value?.currencyCode ?? defaultCurrencyCode
	const currentCurrency = currentCurrencyCode ? currencyGet(currentCurrencyCode) : undefined

	const scale = amountScaleFor(currentCurrencyCode)

	// The typed text is held as TEXT while it is being typed. Rendering `String(value.amount)` back into the
	// input erased the decimal separator on the keystroke that typed it — `parseFloat('5.')` is `5` — so a
	// fractional amount could not be entered on mobile at all. The form still receives only the number.
	const [amountValue, setAmountValue] = useState<string>(value?.amount != null ? String(value.amount) : '')

	// Re-sync when the value changes from OUTSIDE: a form reset, supplied initial values, or the re-clamp a
	// currency switch performs. Compared through `parseAmountText` rather than by string, so a buffer that is
	// merely mid-keystroke (`5.`, `5.0`) is left alone — comparing text would delete the separator again.
	useEffect(() => {
		const incoming = value?.amount as number | null | undefined
		if (incoming == null) {
			if (parseAmountText(amountValue) !== null) setAmountValue('')
			return
		}
		if (parseAmountText(amountValue) !== incoming) setAmountValue(String(incoming))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value?.amount])

	const modalOptions = useMemo(
		() => currencyOptions.map((opt) => ({ ...opt, flag: opt.countryCode })),
		[currencyOptions]
	)

	const borderColor = hasError ? colors?.error : isDark ? colors?.muted : colors?.muted

	const activeBorderColor = isDark ? colors?.accent : colors?.primary

	const [isFocused, setIsFocused] = useState(false)

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				<View
					style={[
						StyleSheet.flatten(componentStyles.row),
						{
							borderBottomColor: hasError ? colors?.error : isFocused ? activeBorderColor : borderColor,
							borderBottomWidth: isFocused ? 2 : input.borderWidth,
						},
					]}>
					<TextInput
						testID={`field-${name}-input`}
						accessibilityLabel={label ?? name}
						style={[
							StyleSheet.flatten(componentStyles.amountInput),
							{ color: hasError ? colors?.error : colors?.text },
						]}
						value={amountValue}
						placeholder={placeholder ?? amountPlaceholderFor(scale)}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						keyboardType={amountKeyboardFor(scale)}
						editable={!disabled}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							setIsFocused(false)
						}}
						onChangeText={(text) => {
							const sanitized = sanitizeAmountText(text, scale)
							setAmountValue(sanitized)
							onChange({
								amount: parseAmountText(sanitized),
								currencyCode: currentCurrencyCode,
							})
						}}
					/>
					<Pressable
						testID={`field-${name}-currency`}
						accessibilityLabel={`${label ?? name} currency`}
						disabled={disabled || fixedSelection}
						style={StyleSheet.flatten(componentStyles.currencyPicker)}
						onPress={() => setModalVisible(true)}>
						{currentCurrency?.flag ? <Flag code={currentCurrency.flag.toLowerCase()} size={24} /> : null}
						<Text style={[StyleSheet.flatten(componentStyles.currencyCode), { color: colors?.text }]}>
							{currentCurrency?.code ?? currentCurrencyCode}
						</Text>
						<Icon
							family={`MaterialCommunityIcons`}
							name={`chevron-down`}
							size={20}
							color={colors?.muted}
							style={{ opacity: disabled || fixedSelection ? 0.2 : 1 }}
						/>
					</Pressable>
				</View>
			</FieldHelper>

			<ModalFormField
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				template={`currency`}
				options={modalOptions}
				onSelect={(item: TGeneric) => {
					// Switching currency re-fits the amount to the NEW currency's scale. Carrying `5.75`
					// unchanged into UGX would leave the field showing a precision that currency has no way to
					// hold, and hand `be/` a fractional minor amount it refuses — after the user has moved on.
					// `clampAmountToScale`, never `sanitizeAmountText`: sanitizing is keystroke logic and would
					// strip the separator rather than the fraction, turning 5.75 into 575.
					const nextScale = amountScaleFor(item.value as string)
					const reclamped = clampAmountToScale(parseAmountText(amountValue), nextScale)
					setAmountValue(reclamped == null ? '' : String(reclamped))
					onChange({
						amount: reclamped,
						currencyCode: item.value,
					})
				}}>
				{null}
			</ModalFormField>
		</>
	)
}
