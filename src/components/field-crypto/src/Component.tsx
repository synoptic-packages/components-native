import React, { useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { StyleSheet, TextInput, View } from 'react-native'

import { Icon } from '../../icon/index'
import { ModalFormField } from '../../modal/index'
import { Pressable } from '../../pressable/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

interface CryptoAsset {
	symbol: string
	name: string
	slug: string
	color?: string
	colorDark?: boolean
}

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	defaultAssetSymbol?: string
	fixedSelection?: boolean
	/** Asset catalogue (the app reads this from its store); required, no store in package. */
	assets: CryptoAsset[]
	/**
	 * Asset icon renderer (the app renders its own crypto SVG set).
	 * Defaults to nothing — the tinted circle still shows the asset colour.
	 */
	renderAssetIcon?: (_asset: CryptoAsset | undefined) => React.ReactNode
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	placeholder = '0.00',
	defaultAssetSymbol = 'BTC',
	fixedSelection = false,
	assets: availableAssets,
	renderAssetIcon,
	control,
	rules,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [modalVisible, setModalVisible] = useState(false)
	const [isFocused, setIsFocused] = useState(false)

	const {
		field: { onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	const hasError = Boolean(error?.message) && isTouched

	const modalOptions = useMemo(
		() =>
			availableAssets.map((item) => ({
				label: item.name,
				value: item.symbol,
				slug: item.slug,
				colorDark: item.colorDark,
				color: item.color,
				subTitle: item.symbol,
			})),
		[availableAssets]
	)

	const currentSymbol: string = value?.assetSymbol ?? defaultAssetSymbol
	const currentAsset = availableAssets.find((item) => item.symbol?.toUpperCase() === currentSymbol?.toUpperCase())

	const amountValue: string = value?.amount != null ? String(value.amount) : ''

	const activeBorderColor = isDark ? colors?.accent : colors?.primary

	if (modalOptions.length === 0) return null

	return (
		<>
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
				<View
					style={[
						StyleSheet.flatten(componentStyles.row),
						{
							borderBottomColor: hasError ? colors?.error : isFocused ? activeBorderColor : colors?.muted,
							borderBottomWidth: isFocused ? 2 : input.borderWidth,
						},
					]}>
					<TextInput
						testID={`field-${name}-input`}
						style={[
							StyleSheet.flatten(componentStyles.amountInput),
							{ color: hasError ? colors?.error : colors?.text },
						]}
						value={amountValue}
						placeholder={placeholder}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						keyboardType={`decimal-pad`}
						editable={!disabled}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						onChangeText={(text) => {
							if (disabled) return
							onChange({ amount: text, assetSymbol: currentSymbol })
						}}
					/>
					<Pressable
						disabled={disabled || fixedSelection}
						style={StyleSheet.flatten(componentStyles.assetPicker)}
						onPress={() => setModalVisible(true)}>
						<View
							style={[
								StyleSheet.flatten(componentStyles.assetIcon),
								{ backgroundColor: currentAsset?.color ?? colors?.muted },
							]}>
							{renderAssetIcon?.(currentAsset) ?? null}
						</View>
						<TextInput
							style={[StyleSheet.flatten(componentStyles.assetSymbol), { color: colors?.text }]}
							value={currentAsset?.symbol ?? defaultAssetSymbol}
							editable={false}
							pointerEvents={`none`}
						/>
						<Icon
							family={`MaterialCommunityIcons`}
							name={`chevron-down`}
							size={22}
							color={colors?.muted}
							style={{ opacity: disabled || fixedSelection ? 0.3 : 1 }}
						/>
					</Pressable>
				</View>
			</FieldHelper>

			{fixedSelection ? null : (
				<ModalFormField
					isVisible={modalVisible}
					setIsVisible={setModalVisible}
					template={`crypto`}
					options={modalOptions}
					renderCryptoIcon={(item: TGeneric) =>
						renderAssetIcon?.({
							symbol: String(item?.value ?? ''),
							name: String(item?.label ?? ''),
							slug: String(item?.slug ?? ''),
							color: typeof item?.color === 'string' ? item.color : undefined,
							colorDark: item?.colorDark === true,
						})
					}
					onSelect={(item: TGeneric) => {
						onChange({ amount: value?.amount ?? null, assetSymbol: item.value })
					}}>
					{null}
				</ModalFormField>
			)}
		</>
	)
}

