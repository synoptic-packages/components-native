import React from 'react'

import { useTheme } from '../../../hooks/useTheme'
import { withOpacity } from '../../../lib/color'
import { Button } from '../../button/index'
import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { styles } from './styles'
import type { StatusAction, StatusErrorProps } from './types'

function getButtonMode(variant: StatusAction['variant']) {
	return variant === 'contained' ? 'contained' : 'outlined'
}

export const Component: React.FC<StatusErrorProps> = (props) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	const actions: StatusAction[] = [
		...(props.actions || []),
		{
			path: '/',
			label: 'Complete',
			variant: 'contained',
			color: 'error',
		},
	]

	return (
		<View style={componentStyles.screen} testID={props.testID}>
			<View style={componentStyles.card}>
				<View style={[componentStyles.iconWrap, { backgroundColor: withOpacity(String(colors.error), 0.12) }]}>
					<Icon name={`SyError`} size={38} color={`error`} />
				</View>
				<Text size={28} variant={`displayMedium`} style={componentStyles.title}>
					{props.title}
				</Text>
				{props.objectNumber ? (
					<Text size={12} style={componentStyles.objectNumber}>
						{props.objectNumber}
					</Text>
				) : null}
				<Text size={16} style={componentStyles.subTitle}>
					{props.subTitle || 'An error occurred'}
				</Text>
				<View style={componentStyles.actions}>
					{actions.map((action, index) => (
						<Button
							key={`${action.label}-${index}`}
							mode={getButtonMode(action.variant)}
							size={`large`}
							variant={action.color || `primary`}
							style={componentStyles.actionButton}
							onPress={async () => {
								if (action.onClick) {
									await action.onClick()
									return
								}
								if (action.path) {
									await props.onNavigate?.(action.path)
									return
								}
								await props.onNavigate?.('/')
							}}>
							{action.label || `Action ${index + 1}`}
						</Button>
					))}
					<Button
						mode={`outlined`}
						size={`large`}
						variant={`error`}
						style={componentStyles.actionButton}
						onPress={() => props.onClose?.()}>
						Close
					</Button>
				</View>
			</View>
		</View>
	)
}
