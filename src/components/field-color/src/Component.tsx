import React, { useCallback, useMemo, useState } from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { TextInput as InputNative, StyleSheet } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'
import ColorPicker, { HueSlider, InputWidget, Panel1, Preview, Swatches } from 'reanimated-color-picker'

import { Button } from '../../button/index'
import { Icon } from '../../icon/index'
import { Modal } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { SafeAreaView, View } from '../../view/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

const DEFAULT_COLOR = '#ffffff'

const SWATCH_COLORS = [
	'#ef4444',
	'#f97316',
	'#f59e0b',
	'#84cc16',
	'#22c55e',
	'#14b8a6',
	'#06b6d4',
	'#3b82f6',
	'#8b5cf6',
	'#ec4899',
	'#111827',
	'#ffffff',
]

interface PickerColorResult {
	hex: string
}

const isHexColor = (value: string): boolean => /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(value)

const resolveSwatchColor = (value: string): string => {
	return isHexColor(value) ? value : DEFAULT_COLOR
}

export interface FieldComponentProps {
	name: string
	label?: string
	hint?: string
	disabled?: boolean
	placeholder?: string
	onChange?: (_value: TGeneric) => void
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder,
	onChange: onValueChange,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [modalVisible, setModalVisible] = useState(false)
	const [draftColor, setDraftColor] = useState(DEFAULT_COLOR)
	const [isFocused, setIsFocused] = useState(false)
	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })

	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const resolvedValue = typeof value === 'string' ? value : value == null ? '' : String(value)
	const pickerColor = useMemo(() => resolveSwatchColor(resolvedValue), [resolvedValue])
	const hasPendingSelection = draftColor.toLowerCase() !== pickerColor.toLowerCase()
	const isDisabledWithValue = disabled && Boolean(resolvedValue)
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	const handleValueChange = useCallback(
		(nextValue: string) => {
			if (typeof onValueChange === 'function') {
				onValueChange(nextValue)
				return
			}

			onChange(nextValue)
		},
		[onChange, onValueChange]
	)

	const handleOpenModal = useCallback(() => {
		setDraftColor(pickerColor)
		setModalVisible(true)
	}, [pickerColor])

	const handleCloseModal = useCallback(() => {
		setDraftColor(pickerColor)
		setModalVisible(false)
	}, [pickerColor])

	const handleConfirmModal = useCallback(() => {
		if (hasPendingSelection) {
			handleValueChange(draftColor)
		}

		setModalVisible(false)
	}, [draftColor, handleValueChange, hasPendingSelection])

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				<TextInputNative
					mode={`flat`}
					value={resolvedValue}
					placeholder={placeholder ?? 'Select a color...'}
					dense={true}
					disabled={disabled}
					underlineColor={hasError ? activeColor : isFocused ? activeColor : colors?.muted}
					activeUnderlineColor={activeColor}
					error={hasError}
					placeholderTextColor={hasError ? colors?.error : colors?.muted}
					textColor={hasError ? colors?.error : colors?.text}
					underlineStyle={{ height: input.borderWidth }}
					contentStyle={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent' }}
					style={componentStyles.input}
					render={(inputProps) => (
						<View style={componentStyles.inputContent}>
							<Pressable
								style={[componentStyles.swatchButton, { backgroundColor: pickerColor }]}
								disabled={disabled}
								onPress={disabled ? undefined : handleOpenModal}
							/>
							<InputNative
								{...inputProps}
								value={resolvedValue}
								onBlur={(event) => {
									inputProps.onBlur?.(event)
									setIsFocused(false)
								}}
								onFocus={(event) => {
									inputProps.onFocus?.(event)
									setIsFocused(true)
								}}
								onChangeText={handleValueChange}
								placeholder={placeholder ?? 'Select a color...'}
								autoCapitalize={`characters`}
								autoCorrect={false}
								autoComplete={`off`}
								editable={!disabled}
								style={[
									inputProps.style,
									StyleSheet.flatten(componentStyles.nativeInput),
									{ color: hasError ? colors?.error : colors?.text },
								]}
							/>
							<Pressable
								style={componentStyles.chevronButton}
								disabled={disabled}
								onPress={disabled ? undefined : handleOpenModal}>
								{isDisabledWithValue ? (
									<Icon family={`Lucide`} name={`Check`} size={20} color={colors?.success} />
								) : (
									<Icon
										family={`MaterialCommunityIcons`}
										name={`chevron-down`}
										size={22}
										color={hasError ? colors?.error : colors?.muted}
										style={disabled ? componentStyles.chevronIconDisabled : null}
									/>
								)}
							</Pressable>
						</View>
					)}
				/>
			</FieldHelper>

			<Modal isVisible={modalVisible} setIsVisible={setModalVisible} onBackdropPress={handleCloseModal}>
				<SafeAreaView style={componentStyles.modalRoot} edges={['left', 'right']}>
					<View style={componentStyles.modalSheet}>
						<View style={componentStyles.modalHeader}>
							<Text variant={`titleMedium`}>{label ?? 'Pick a color'}</Text>
							<Text color={`muted`} style={{ marginTop: 4 }}>
								{hint ?? 'Choose a color from the panel, hue slider, or swatch presets.'}
							</Text>
						</View>
						<View style={componentStyles.pickerCard}>
							<ColorPicker
								style={componentStyles.picker}
								value={draftColor}
								onChangeJS={(selected: PickerColorResult) => setDraftColor(selected.hex)}>
								<Preview
									hideInitialColor={true}
									colorFormat={`hex`}
									style={componentStyles.preview}
									textStyle={{ color: colors?.text }}
								/>
								<Panel1 style={componentStyles.panel} />
								<HueSlider style={componentStyles.slider} />
								<InputWidget
									defaultFormat={`HEX`}
									disableAlphaChannel={true}
									formats={['HEX']}
									containerStyle={componentStyles.inputWidgetContainer}
									inputStyle={componentStyles.inputWidgetInput}
									inputTitleStyle={componentStyles.inputWidgetTitle}
									inputProps={{
										placeholderTextColor: colors?.muted,
										selectionColor: isDark ? colors?.accent : colors?.primary,
									}}
									iconColor={String(colors?.muted)}
								/>
								<Swatches
									colors={SWATCH_COLORS}
									style={componentStyles.swatches}
									swatchStyle={componentStyles.swatchOption}
								/>
							</ColorPicker>
						</View>
						<View style={componentStyles.actions}>
							<Button mode={`outlined`} onPress={handleConfirmModal} style={componentStyles.actionButton}>
								{hasPendingSelection ? 'Select' : 'Close'}
							</Button>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
		</>
	)
}
