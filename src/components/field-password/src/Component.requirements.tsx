import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import type { PasswordStrength } from '../../../lib/password'
import { useTheme } from '../../../hooks/useTheme'
import React from 'react'
import { View } from 'react-native'
import { styles } from './styles'

export interface PasswordRequirementLabels {
	title: string
	minLength8: string
	uppercase: string
	lowercase: string
	number: string
	specialCharacter: string
}

const defaultRequirementLabels: PasswordRequirementLabels = {
	title: 'Your password must contain:',
	minLength8: 'At least 8 characters',
	uppercase: 'At least 1 uppercase letter',
	lowercase: 'At least 1 lowercase letter',
	number: 'At least 1 number',
	specialCharacter: 'At least 1 special character',
}

interface PasswordRequirementsProps {
	passwordStrength: PasswordStrength
	hasError?: boolean
	/** Localised copy; the app passes its own i18n strings. English defaults. */
	labels?: PasswordRequirementLabels
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
	passwordStrength,
	hasError,
	labels = defaultRequirementLabels,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const { checks } = passwordStrength
	const requirementConfig: { key: keyof PasswordStrength['checks']; label: string }[] = [
		{ key: 'hasMinLength', label: labels.minLength8 },
		{ key: 'hasUppercase', label: labels.uppercase },
		{ key: 'hasLowercase', label: labels.lowercase },
		{ key: 'hasNumber', label: labels.number },
		{ key: 'hasSpecialChar', label: labels.specialCharacter },
	]

	return (
		<View style={componentStyles.requirementsContainer}>
			<Text variant={`labelMedium`} style={componentStyles.requirementsTitle}>
				{labels.title}
			</Text>
			{requirementConfig.map(({ key, label }) => {
				const isMet = checks[key]
				return (
					<View key={key} style={componentStyles.requirementItem}>
						<Icon
							family={`Lucide`}
							name={isMet ? 'Check' : hasError ? 'X' : 'Minus'}
							size={16}
							color={isMet ? 'success' : hasError ? 'error' : 'text'}
						/>
						<Text
							style={componentStyles.requirementText}
							color={isMet ? 'success' : hasError ? 'error' : 'text'}
							variant={`bodySmall`}>
							{label}
						</Text>
					</View>
				)
			})}
		</View>
	)
}
