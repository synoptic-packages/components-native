import { upperFirst } from 'lodash'
import React, { ReactNode } from 'react'
import { Control, Controller, useController, useFormState } from 'react-hook-form'
import { HelperText } from 'react-native-paper'

import { styles } from './__helpers.styles'
import { useTheme } from '../../hooks/useTheme'
import { TGeneric } from '../../types'
import { Text } from '../text'
import { View } from '../view'

interface ComponentProps {
	name: string
	label?: string
	hint?: string
	children?: ReactNode
	showError?: boolean
	testID?: string
	/**
	 * Text alignment for the label, hint and error. Defaults to `left`, so every existing field is
	 * unchanged. `center` exists for a field whose INPUT is centred — `FieldAmountPad`'s big money
	 * figure — where a left-aligned band hint under a centred amount reads as a mistake.
	 */
	align?: 'left' | 'center'
	control: Control<TGeneric> | TGeneric
}

export const FieldComponent: React.FC<ComponentProps> = ({
	name,
	label,
	children,
	hint,
	control,
	testID,
	showError = true,
	align = 'left',
}) => {
	const { colors } = useTheme()
	const centered = align === 'center'
	const {
		fieldState: { error, isTouched },
	} = useController({ name, control })
	const { submitCount } = useFormState({ control })
	const hasError = showError && Boolean(error?.message) && (submitCount > 0 || isTouched)

	function getInputFieldErrorMessage(error: any): string {
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

	// `upperFirst`, NOT `capitalize`. lodash's `capitalize` lowercases everything after the first
	// character, so it silently mangled every message containing a currency symbol, an acronym or a
	// proper noun — "Offer between R777.14 and R930.00" rendered as "r777.14 and r930.00". It affected
	// every field in the app and was only ever visible in a message long enough to contain one.
	return (
		<View style={styles.helper} testID={testID ?? `field-${name}`}>
			{label && (
				<Text variant={`labelMedium`} align={align} style={{ margin: 0 }} color={hasError ? `error` : `text`}>
					{label}
				</Text>
			)}
			<Controller control={control} name={name} render={() => <View>{children}</View>} />
			{hasError ? (
				// `field-<name>-error` so a flow can assert the REFUSAL, not just the absence of progress.
				// Every field routes its error through here, so one id covers the whole family — and a
				// refusal an acceptance test cannot see is a refusal nobody proves is shown.
				<HelperText
					testID={`field-${name}-error`}
					type={`error`}
					visible={Boolean(error)}
					style={[styles.helperText, centered ? styles.helperTextCentered : null, { color: colors?.error }]}>
					{upperFirst(getInputFieldErrorMessage(error))}
				</HelperText>
			) : hint ? (
				<HelperText
					type={`info`}
					visible={hint.length > 0}
					style={[styles.helperText, centered ? styles.helperTextCentered : null]}>
					{hint}
				</HelperText>
			) : null}
		</View>
	)
}
