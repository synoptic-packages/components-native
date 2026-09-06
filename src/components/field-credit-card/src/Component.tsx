import valid from 'card-validator'
import React, { useEffect, useMemo, useState } from 'react'
import { useController, useFormState, type Control } from 'react-hook-form'
import { Image, TextInput as InputNative } from 'react-native'
import MaskInput, { Masks } from 'react-native-mask-input'

import type { ImageSourcePropType } from 'react-native'
import { View } from '../../view/index'
import { input } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface CreditCardValue {
	cardNumber: string
	cvv: string
	cardType: string
}

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	/**
	 * Card-brand artwork by network key (`visa`, `mastercard`, …). The app
	 * supplies its own image set; without it the brand badge simply hides.
	 */
	cardImages?: Partial<Record<string, ImageSourcePropType>>
}

const CARD_TYPE_IMAGE_MAP: Record<string, string> = {
	visa: 'visa',
	mastercard: 'mastercard',
	'american-express': 'american-express',
	discover: 'discover',
	jcb: 'jcb',
	'diners-club': 'diners-club',
	unionpay: 'unionpay',
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	control,
	rules,
	cardImages,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const [rawCardNumber, setRawCardNumber] = useState('')
	const [rawCvv, setRawCvv] = useState('')
	const [isCardFocused, setIsCardFocused] = useState(false)
	const [isCvvFocused, setIsCvvFocused] = useState(false)

	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })

	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const activeBorderColor = isDark ? colors?.accent : colors?.primary

	const cardValidation = useMemo(() => {
		return valid.number(rawCardNumber)
	}, [rawCardNumber])

	const cardType = cardValidation.card?.type ?? ''
	const cvvLength = cardValidation.card?.code?.size ?? 3

	const cardImageKey = CARD_TYPE_IMAGE_MAP[cardType]
	const cardImageSource = cardImageKey ? cardImages?.[cardImageKey] : null

	useEffect(() => {
		onChange({
			cardNumber: rawCardNumber,
			cvv: rawCvv,
			cardType,
		})
	}, [rawCardNumber, rawCvv, cardType, onChange])

	useEffect(() => {
		if (!value) {
			setRawCardNumber('')
			setRawCvv('')
		}
	}, [value])

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<View style={componentStyles.row}>
				<View
					style={[
						componentStyles.cardField,
						{
							borderBottomColor: hasError
								? colors?.error
								: isCardFocused
									? activeBorderColor
									: colors?.muted,
							borderBottomWidth: isCardFocused ? 2 : input.borderWidth,
						},
					]}>
					<MaskInput
						testID={`field-${name}-input`}
						accessibilityLabel={label ?? `Card number`}
						value={rawCardNumber}
						onChangeText={(_masked, unmasked) => setRawCardNumber(unmasked ?? '')}
						onFocus={() => setIsCardFocused(true)}
						onBlur={() => {
							onBlur()
							setIsCardFocused(false)
						}}
						mask={Masks.CREDIT_CARD}
						placeholder={`0000 0000 0000 0000`}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						keyboardType={`numeric`}
						editable={!disabled}
						style={[componentStyles.cardInput, { color: hasError ? colors?.error : colors?.text }]}
					/>
					{cardImageSource ? (
						<View
							backgroundColor={`muted`}
							paddingHorizontal={4}
							borderRadius={4}
							overflow={`hidden`}
							justifyContent={`center`}
							alignItems={`center`}>
							<Image source={cardImageSource} style={componentStyles.cardImage} resizeMode={`contain`} />
						</View>
					) : null}
				</View>
				<View
					style={[
						componentStyles.cvvField,
						{
							borderBottomColor: hasError
								? colors?.error
								: isCvvFocused
									? activeBorderColor
									: colors?.muted,
							borderBottomWidth: isCvvFocused ? 2 : input.borderWidth,
						},
					]}>
					<InputNative
						testID={`field-${name}-cvv`}
						accessibilityLabel={`CVV`}
						value={rawCvv}
						onChangeText={(text) => setRawCvv(text.replace(/\D/g, '').slice(0, cvvLength))}
						onFocus={() => setIsCvvFocused(true)}
						onBlur={() => {
							onBlur()
							setIsCvvFocused(false)
						}}
						placeholder={`CVV`}
						placeholderTextColor={hasError ? colors?.error : colors?.muted}
						keyboardType={`numeric`}
						maxLength={cvvLength}
						editable={!disabled}
						secureTextEntry
						style={[componentStyles.cvvInput, { color: hasError ? colors?.error : colors?.text }]}
					/>
				</View>
			</View>
		</FieldHelper>
	)
}
