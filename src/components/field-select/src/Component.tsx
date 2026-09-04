import React, { useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, StyleSheet } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { Option, TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	placeholder?: string
	options: Option[]
	left?: React.ReactNode
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder,
	options,
	left,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [modalVisible, setModalVisible] = useState(false)

	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched
	const selected = options.find((o) => o.value === value)

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				<TextInputNative
					mode={`flat`}
					value={selected?.label ?? ''}
					placeholder={placeholder}
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
							testID={`field-${name}-trigger`}
							accessibilityRole={`button`}
							accessibilityLabel={label ?? placeholder ?? name}
							style={componentStyles.inputContent}
							onPress={disabled ? undefined : () => setModalVisible(true)}>
							{left ? <React.Fragment>{left}</React.Fragment> : null}
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
			</FieldHelper>

			<ModalFormField
				isVisible={modalVisible}
				setIsVisible={setModalVisible}
				options={options}
				onSelect={(item: TGeneric) => onChange(item.value)}>
				{null}
			</ModalFormField>
		</>
	)
}
