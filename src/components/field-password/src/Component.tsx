import { TGeneric } from '../../../types'
import { toStringOrEmpty } from '../../../lib/string'
import { usePassword, type PasswordLabels } from '../../../lib/password'
import React from 'react'
import { type Control, useController, useFormState, useWatch } from 'react-hook-form'
import { View } from 'react-native'
import {
	Component as FieldText,
	type FieldComponentProps as FieldTextComponentProps,
} from '../../field-text/src/Component'
import { ComponentIndicator } from './Component.indicator'
import { PasswordRequirements } from './Component.requirements'

const defaultPasswordLabels: PasswordLabels = {
	veryWeak: 'Very Weak',
	weak: 'Weak',
	good: 'Good',
	strong: 'Strong',
}

type FieldComponentProps = Omit<FieldTextComponentProps, 'type'> & {
	strengthIndicatorVariant?: 'bar' | 'checklist' | 'both'
	/** Localised strength labels; the app passes its own i18n strings. English defaults. */
	strengthLabels?: PasswordLabels
}

export const Component: React.FC<FieldComponentProps> = ({
	strengthIndicatorVariant,
	strengthLabels = defaultPasswordLabels,
	control,
	name,
	...props
}) => {
	const value = useWatch({ control: control as Control<TGeneric>, name }) ?? ''
	const { passwordStrength } = usePassword(toStringOrEmpty(value), {}, strengthLabels)
	const {
		fieldState: { error, isTouched },
	} = useController({ name, control: control as Control<TGeneric> })
	const { submitCount } = useFormState({ control: control as Control<TGeneric> })
	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const showStrengthBar = strengthIndicatorVariant === 'bar' || strengthIndicatorVariant === 'both'
	const showRequirements = strengthIndicatorVariant === 'checklist' || strengthIndicatorVariant === 'both'

	return (
		<View>
			<FieldText {...props} control={control} name={name} type={`password`} />
			{showStrengthBar && <ComponentIndicator passwordStrength={passwordStrength} />}
			{showRequirements && <PasswordRequirements passwordStrength={passwordStrength} hasError={hasError} />}
		</View>
	)
}
