import React from 'react'
import { useController, type Control } from 'react-hook-form'
import { Platform } from 'react-native'
import { Switch } from 'react-native-paper'

import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({ name, label, hint, disabled = false, control, rules }) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const {
		field: { onChange, value },
	} = useController({ name, control, rules })

	const checked = Boolean(value)
	const handleToggle = () => {
		if (disabled) return
		onChange(!checked)
	}

	return (
		<FieldHelper control={control} name={name} hint={hint} showError={true}>
			<Pressable
				testID={`field-${name}-switch`}
				accessibilityRole={`switch`}
				style={componentStyles.row}
				onPress={handleToggle}
				disabled={disabled}>
				<Switch
					value={checked}
					disabled={disabled}
					color={isDark ? colors?.accent : colors?.primary}
					onValueChange={onChange}
					style={[
						componentStyles.switch,
						{ backgroundColor: Platform.OS === 'ios' ? colors?.muted : 'transparent' },
					]}
				/>
				{label ? (
					<Text variant={`bodyMedium`} color={disabled ? `muted` : `text`} style={componentStyles.label}>
						{label}
					</Text>
				) : null}
			</Pressable>
		</FieldHelper>
	)
}
