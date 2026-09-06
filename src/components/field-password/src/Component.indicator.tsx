import type { PasswordStrength } from '../../../lib/password'
import { Progress } from '../../progress/index'
import { useTheme } from '../../../hooks/useTheme'
import type { ThemeColors } from '../../../theme/colors'
import React from 'react'
import { View } from 'react-native'
import { styles } from './styles'

const scoreColorKey: Record<PasswordStrength['score'], keyof ThemeColors> = {
	0: 'muted',
	1: 'error',
	2: 'warning',
	3: 'info',
	4: 'success',
}

interface ComponentIndicatorProps {
	passwordStrength: PasswordStrength
}

export const ComponentIndicator: React.FC<ComponentIndicatorProps> = ({ passwordStrength }) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const { score, progress } = passwordStrength
	const color = String(colors[scoreColorKey[score]])

	return (
		<View style={componentStyles.indicatorContainer}>
			<Progress progress={progress} color={color} barStyle={componentStyles.indicatorBar} />
		</View>
	)
}
