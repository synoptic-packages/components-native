import { capitalize } from 'lodash'
import React from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { HelperText } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { Option, TGeneric, ValidationRules } from '../../../types'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	label?: string
	hint?: string
	disabled?: boolean
	row?: boolean
	onChange?: (_value: TGeneric) => void
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	options: Option[]
}

function getInputFieldErrorMessage(name: string, error: any): string {
	const arbitraryMessage = `Please enter a valid ${name}`

	if (!error) {
		return arbitraryMessage
	}

	if (typeof error === 'object' && error.message) {
		return error.message
	}

	if (typeof error === 'string') {
		return error
	}

	try {
		if (typeof error === 'object') {
			const firstKey = Object.keys(error)[0]
			const nestedError = error[firstKey]
			if (nestedError && typeof nestedError === 'object' && nestedError.message) {
				return nestedError.message
			}
			return firstKey ? `${nestedError}` : arbitraryMessage
		}
	} catch {
		return arbitraryMessage
	}

	return arbitraryMessage
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	row = false,
	onChange: onValueChange,
	control,
	rules,
	options,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { value, onChange },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })

	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const helperText = hasError ? capitalize(getInputFieldErrorMessage(name, error)) : hint
	const checkedIconColor = isDark ? colors?.accent : colors?.primary
	const uncheckedIconColor = colors?.muted

	const handleChange = (nextValue: string) => {
		if (disabled) return

		if (typeof onValueChange === 'function') {
			onValueChange(nextValue)
			return
		}

		onChange(nextValue)
	}

	return (
		<View style={componentStyles.container} testID={`field-${name}`}>
			{label ? (
				<Text variant={`labelMedium`} color={hasError ? `error` : `text`} style={componentStyles.groupLabel}>
					{label}
				</Text>
			) : null}
			<View style={[componentStyles.optionsContainer, row ? componentStyles.optionsRow : null]}>
				{options.map((option, index) => {
					const optionHint = !row && typeof option.hint === 'string' ? option.hint : undefined
					const isSelected = option.value === value

					return (
						<Pressable
							key={`${name}-${index}`}
							// The option-set contract from AGENTS.md's remediation cycle: a deterministic id
							// derived from the option VALUE, plus the radio role/state so a flow (and a screen
							// reader) can tell which one is chosen. Without these a radio group could only be
							// driven by visible label text, which is localized and therefore untestable.
							testID={`field-${name}-option-${option.value}`}
							accessibilityRole={`radio`}
							accessibilityState={{ selected: isSelected, disabled }}
							accessibilityLabel={option.label}
							style={[componentStyles.optionRow, row ? componentStyles.optionRowInline : null]}
							onPress={disabled ? undefined : () => handleChange(option.value)}
							disabled={disabled}>
							<View style={row ? componentStyles.radioWrapInline : componentStyles.radioWrap}>
								<Icon
									family={`MaterialCommunityIcons`}
									name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
									size={28}
									color={isSelected ? checkedIconColor : uncheckedIconColor}
									style={disabled ? componentStyles.radioIconDisabled : null}
								/>
							</View>
							<View
								style={[
									componentStyles.optionContent,
									row ? componentStyles.optionContentInline : null,
								]}>
								<Text
									variant={`labelSmall`}
									color={disabled ? `muted` : hasError ? `error` : `text`}
									margin={0}
									padding={0}
									style={row ? componentStyles.optionLabelInline : undefined}>
									{option.label}
								</Text>
								{optionHint ? (
									<HelperText type={`info`} visible={true} style={componentStyles.optionHint}>
										{optionHint}
									</HelperText>
								) : null}
							</View>
						</Pressable>
					)
				})}
			</View>
			{helperText ? (
				<HelperText
					type={hasError ? `error` : `info`}
					visible={true}
					style={[componentStyles.helperText, hasError ? { color: colors?.error } : null]}>
					{helperText}
				</HelperText>
			) : null}
		</View>
	)
}
