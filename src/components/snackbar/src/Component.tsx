import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import * as React from 'react'
import { View } from 'react-native'
import type { SnackbarProps as PaperSnackbarProps } from 'react-native-paper'
import { Snackbar as PaperSnackbar } from 'react-native-paper'

import styles from './styles'

export type SnackbarSeverity = 'error' | 'success' | 'info' | 'warning'

export interface ComponentProps extends Omit<PaperSnackbarProps, 'children' | 'icon' | 'visible' | 'onDismiss'> {
	message?: string
	severity?: SnackbarSeverity
	onDismiss?: () => void
	open?: boolean
	testID?: string
}

export const ComponentEmpty: ComponentProps = {
	message: '',
	severity: 'info',
	onDismiss: () => {},
	open: false,
}

const severityColors: Record<SnackbarSeverity, ColorName> = {
	error: 'error',
	success: 'success',
	info: 'info',
	warning: 'warning',
}

const severityTextColors: Record<SnackbarSeverity, ColorName> = {
	error: 'white',
	success: 'white',
	info: 'white',
	warning: 'black',
}

export const Component: React.FC<ComponentProps> = ({
	action,
	duration = 6000,
	elevation = 3,
	message,
	onDismiss,
	open = false,
	severity = 'info',
	style,
	...props
}) => {
	const { colors } = useTheme()
	const severityColor = severityColors[severity]
	const messageColor = severityTextColors[severity]

	return (
		<PaperSnackbar
			{...props}
			action={action}
			duration={duration}
			elevation={elevation}
			// icon={({ size }) => (
			icon={() => (
				<View pointerEvents={`box-none`} style={styles.iconBadge}>
					<Icon family={`MaterialCommunityIcons`} name={`close`} color={severityColor} size={18} />
				</View>
			)}
			visible={Boolean(open && message)}
			// @ts-ignore
			onDismiss={onDismiss}
			onIconPress={onDismiss}
			style={[
				styles.container,
				{
					backgroundColor: String(colors[severityColor]),
				},
				style,
			]}>
			<Text variant={`bodySmall`} color={messageColor} style={styles.message}>
				{message}
			</Text>
		</PaperSnackbar>
	)
}

Component.displayName = 'Snackbar'
