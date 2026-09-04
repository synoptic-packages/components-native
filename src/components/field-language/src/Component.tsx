import { Flag } from '@synotech/flags'
import React, { useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, StyleSheet } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import languagesData from './../../../constants/languages.json'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

interface Language {
	code: string
	flag: string
	label: { en: string; [key: string]: string }
}

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	placeholder?: string
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder,
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

	const options = useMemo(
		() =>
			(languagesData as Language[]).map((lang) => ({
				label: lang.label.en,
				value: lang.code,
				flag: lang.flag,
			})),
		[]
	)

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
					underlineColor={colors?.muted}
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
							{selected ? (
								<Flag code={selected.flag?.toLowerCase()} size={20} style={componentStyles.flagIcon} />
							) : null}
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
				template={`language`}
				options={options}
				onSelect={(item: TGeneric) => onChange(item.value)}>
				{null}
			</ModalFormField>
		</>
	)
}
