import { capitalize, startCase } from 'lodash'
import React from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { HelperText } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	title?: string
	label?: string
	hint?: string
	disabled?: boolean
	onChange?: (_value: boolean) => void
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
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
	title,
	label,
	hint,
	disabled = false,
	onChange: onValueChange,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { value, onChange },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })

	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const checked = Boolean(value)
	const helperText = hasError ? capitalize(getInputFieldErrorMessage(name, error)) : hint
	const iconColor = hasError ? colors?.error : checked ? (isDark ? colors?.accent : colors?.primary) : colors?.muted

	const handleChange = (nextValue: boolean) => {
		if (disabled) return

		if (typeof onValueChange === 'function') {
			onValueChange(nextValue)
			return
		}

		onChange(nextValue)
	}

	return (
		// The wrapper carries `field-<name>` and the toggle carries `field-<name>-input`, matching the
		// convention every other shared field already follows. Without them a checkbox was invisible to
		// Maestro — the only way to tick one was a coordinate tap, which the testing rules forbid.
		<View style={componentStyles.container} testID={`field-${name}`}>
			{title ? (
				<Text variant={`labelMedium`} color={hasError ? `error` : `text`} style={componentStyles.title}>
					{title}
				</Text>
			) : null}
			<Pressable
				testID={`field-${name}-input`}
				accessibilityRole={`checkbox`}
				accessibilityState={{ checked, disabled }}
				accessibilityLabel={label ?? startCase(name)}
				style={componentStyles.row}
				onPress={() => handleChange(!checked)}
				disabled={disabled}>
				<View style={componentStyles.checkboxWrap}>
					<Icon
						family={checked ? 'Synotech' : 'MaterialCommunityIcons'}
						name={checked ? 'SyCheck' : 'square-rounded-outline'}
						size={24}
						color={iconColor}
						style={disabled ? componentStyles.checkboxIconDisabled : null}
					/>
				</View>
				<View style={componentStyles.content}>
					<Text variant={`labelSmall`} color={disabled ? `muted` : hasError ? `error` : `text`}>
						{label ?? startCase(name)}
					</Text>
					{helperText ? (
						<HelperText
							type={hasError ? `error` : `info`}
							visible={true}
							style={[componentStyles.helperText, hasError ? { color: colors?.error } : null]}>
							{helperText}
						</HelperText>
					) : null}
				</View>
			</Pressable>
		</View>
	)
}
