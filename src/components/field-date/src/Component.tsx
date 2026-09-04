import React, { useEffect, useRef, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import MaskInput, { Masks } from 'react-native-mask-input'

import { Icon } from '../../icon/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	placeholder?: string
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

// Day-first: every market the wallet serves writes DD/MM/YYYY (ZA, LS, UG, ZM, ZW, BW, SZ, MZ, KE,
// RW, TZ, MW, AO, GN, GH, NA). This rendered MM/DD/YYYY and its consumers split month-first, so a
// rider scheduling 03/07 for 3 July was booked for 7 March.
const DATE_FORMAT = 'DD/MM/YYYY'

export const Component: React.FC<FieldComponentProps> = ({ name, label, hint, disabled = false, control, rules }) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [raw, setRaw] = useState('')

	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched

	// The `if (raw)` guard that used to be here meant CLEARING THE FIELD NEVER REACHED THE FORM: the
	// user deleted the text, `raw` became '', the guard failed, and `onChange` was not called — so the
	// form still held the date they had just removed and submitted it. That reaches any date of birth
	// this field collects, where the value binds an age tier and therefore a permission set — not only
	// the cases where a stale date is merely cosmetic.
	//
	// The mount is skipped so an empty field does not immediately dirty a pristine form.
	const hasSyncedRef = useRef(false)
	useEffect(() => {
		if (!hasSyncedRef.current) {
			hasSyncedRef.current = true
			if (!raw) return
		}
		onChange(raw)
	}, [onChange, raw])

	// Sync external reset
	useEffect(() => {
		if (!value) setRaw('')
	}, [value])

	return (
		<FieldHelper
			control={control}
			name={name}
			label={label ? `${label} (${DATE_FORMAT})` : undefined}
			hint={hint}
			showError={true}>
			<View style={[componentStyles.row, { borderBottomColor: hasError ? colors?.error : colors?.muted }]}>
				<MaskInput
					testID={`field-${name}-input`}
					value={raw}
					onChangeText={setRaw}
					mask={Masks.DATE_MMDDYYYY}
					autoCapitalize={`none`}
					autoComplete={`off`}
					placeholder={DATE_FORMAT}
					placeholderTextColor={hasError ? colors?.error : colors?.muted}
					keyboardType={`numeric`}
					editable={!disabled}
					style={[componentStyles.input, { color: hasError ? colors?.error : colors?.text }]}
				/>
				<Icon family={`Feather`} name={`calendar`} size={20} color={isDark ? 'mutedLight' : 'muted'} />
			</View>
		</FieldHelper>
	)
}
