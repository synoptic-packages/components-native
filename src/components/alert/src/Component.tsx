import * as React from 'react'

import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import { Icon } from '../../icon'
import { Text } from '../../text'
import { View } from '../../view'
import styles from './styles'
import { withOpacity } from '../../../lib/color'

export type AlertSeverity = 'success' | 'warning' | 'error' | 'info' | 'accent'
export type AlertVariant = 'outlined' | 'standard' | 'filled'

export interface ComponentProps {
	severity?: AlertSeverity
	message?: string
	variant?: AlertVariant
	/**
	 * Part of the contract, not an extra — the same lesson `Callout` already documents in its own source.
	 * An `Alert` is how this app tells a user why something is not what they expected (a fare adjusted, a
	 * surge in effect, a band edge reached), so it is exactly the element an acceptance test must assert
	 * on, and it could not be selected at all. The wrapper carries the id so the message text stays the
	 * readable content underneath it.
	 */
	testID?: string
	style?: StyleProp<ViewStyle>
	sx?: StyleProp<ViewStyle>
}

const severityColors: Record<AlertSeverity, ColorName> = {
	success: 'success',
	warning: 'warning',
	error: 'error',
	info: 'info',
	accent: 'accent',
}

const severityIcons: Record<
	AlertSeverity,
	{
		family: React.ComponentProps<typeof Icon>['family']
		name: string
	}
> = {
	success: {
		family: 'Synotech',
		name: 'SyDoneAllRound',
	},
	warning: {
		family: 'Ionicons',
		name: 'warning',
	},
	error: {
		family: 'MaterialIcons',
		name: 'error-outline',
	},
	info: {
		family: 'MaterialCommunityIcons',
		name: 'information',
	},
	accent: {
		family: 'MaterialCommunityIcons',
		name: 'information',
	},
}

function getFilledContentColor(severity: AlertSeverity): ColorName {
	switch (severity) {
		case 'warning':
		case 'accent':
			return 'black'
		default:
			return 'white'
	}
}

export const Component: React.FC<ComponentProps> = ({
	severity = 'info',
	variant = 'outlined',
	message,
	testID,
	style,
	sx,
}) => {
	const { colors } = useTheme()

	if (!message) {
		return null
	}

	const severityColor = severityColors[severity]
	const severityHex = String(colors[severityColor])
	const isAccent = severity === 'accent'
	const filledContentColor = getFilledContentColor(severity)
	const outlinedTextColor: ColorName = 'text'

	const variantStyle: ViewStyle =
		variant === 'filled'
			? {
					backgroundColor: severityHex,
					borderColor: severityHex,
				}
			: variant === 'standard'
				? isAccent
					? {
							backgroundColor: severityHex,
							borderColor: severityHex,
						}
					: {
							backgroundColor: withOpacity(severityHex, 0.14),
							borderColor: 'transparent',
						}
				: {
						backgroundColor: String(colors.bgLighter),
						borderColor: severityHex,
						borderWidth: 1.5,
					}

	const contentColor: ColorName =
		variant === 'outlined'
			? outlinedTextColor
			: variant === 'filled' || isAccent
				? filledContentColor
				: severityColor

	const iconColor: ColorName = variant === 'outlined' ? severityColor : contentColor
	const icon = severityIcons[severity]
	const mergedStyle = StyleSheet.flatten([style, sx])

	return (
		<View testID={testID} style={[styles.container, variantStyle, mergedStyle]}>
			<Icon family={icon.family} name={icon.name} size={24} color={iconColor} style={styles.icon} />
			<Text color={contentColor} variant={`bodySmall`} style={styles.message}>
				{message}
			</Text>
		</View>
	)
}

Component.displayName = 'Alert'
