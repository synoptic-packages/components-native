import React, { useCallback, useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { TextInput as InputNative, View } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'

import { Chip } from '../../chip/index'
import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	maxItems?: number
	rules?: ValidationRules
	control: Control<TGeneric> | TGeneric
}

const normalizeArrayValue = (value: TGeneric): string[] => {
	if (Array.isArray(value)) {
		return value
			.filter((item): item is string => typeof item === 'string')
			.map((item) => item.trim())
			.filter(Boolean)
	}

	if (typeof value === 'string') {
		return value
			.split(/[\n,]+/)
			.map((item) => item.trim())
			.filter(Boolean)
	}

	return []
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	control,
	disabled = false,
	placeholder = 'Add item',
	maxItems,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [draft, setDraft] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const items = useMemo(() => normalizeArrayValue(value), [value])
	const hasError = Boolean(error?.message) && isTouched
	const canAdd = Boolean(draft.trim()) && (!maxItems || items.length < maxItems)
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	const addItems = useCallback(
		(rawValue?: string) => {
			if (disabled) return

			const rawItems = (rawValue ?? draft)
				.split(/[\n,]+/)
				.map((item) => item.trim())
				.filter(Boolean)

			if (rawItems.length === 0) return

			const merged = [...items]
			const known = new Set(items.map((item) => item.toLowerCase()))

			for (const item of rawItems) {
				if (maxItems && merged.length >= maxItems) break
				if (known.has(item.toLowerCase())) continue

				known.add(item.toLowerCase())
				merged.push(item)
			}

			onChange(merged)
			setDraft('')
		},
		[disabled, draft, items, maxItems, onChange]
	)

	const removeItem = useCallback(
		(itemToRemove: string) => {
			if (disabled) return

			onChange(items.filter((item) => item !== itemToRemove))
		},
		[disabled, items, onChange]
	)

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<View>
				<TextInputNative
					mode={`flat`}
					value={draft}
					onChangeText={setDraft}
					onSubmitEditing={() => addItems()}
					placeholder={placeholder}
					disabled={disabled}
					dense={true}
					enablesReturnKeyAutomatically
					underlineColor={hasError ? activeColor : isFocused ? activeColor : colors?.muted}
					activeUnderlineColor={activeColor}
					error={hasError}
					placeholderTextColor={hasError ? colors?.error : colors?.muted}
					textColor={hasError ? colors?.error : colors?.text}
					autoComplete={`off`}
					autoCapitalize={`none`}
					autoCorrect={false}
					underlineStyle={{ height: input.borderWidth }}
					contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
					style={componentStyles.input}
					render={(inputProps) => (
						<View style={componentStyles.inputContent}>
							<InputNative
								{...inputProps}
								value={draft}
								onBlur={(event) => {
									inputProps.onBlur?.(event)
									onBlur()
									setIsFocused(false)
								}}
								onFocus={(event) => {
									inputProps.onFocus?.(event)
									setIsFocused(true)
								}}
								onChangeText={setDraft}
								onSubmitEditing={() => addItems()}
								placeholder={placeholder}
								autoComplete={`off`}
								autoCapitalize={`none`}
								autoCorrect={false}
								editable={!disabled}
								style={[
									inputProps.style,
									componentStyles.nativeInput,
									{ color: hasError ? colors?.error : colors?.text },
								]}
							/>
							<Pressable
								style={componentStyles.addButton}
								onPress={canAdd ? () => addItems() : undefined}
								disabled={!canAdd}>
								<Icon
									family={`MaterialCommunityIcons`}
									name={`plus`}
									size={20}
									color={canAdd ? (isDark ? colors?.accent : colors?.primary) : colors?.muted}
									style={!canAdd ? componentStyles.addIconDisabled : null}
								/>
							</Pressable>
						</View>
					)}
				/>
				{items.length > 0 ? (
					<View style={componentStyles.itemsContainer}>
						{items.map((item) => (
							<Chip
								key={item}
								label={`${item}`}
								variant={`outlined`}
								color={hasError ? 'error' : 'default'}
								disabled={disabled}
								onPress={disabled ? undefined : () => removeItem(item)}
							/>
						))}
					</View>
				) : null}
			</View>
		</FieldHelper>
	)
}
