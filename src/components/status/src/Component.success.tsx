import React from 'react'

import { useTheme } from '../../../hooks/useTheme'
import { withOpacity } from '../../../lib/color'
import { Button } from '../../button/index'
import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { styles } from './styles'
import type { StatusAction, StatusSuccessProps } from './types'

function getButtonMode(variant: StatusAction['variant']) {
	return variant === 'contained' ? 'contained' : 'outlined'
}

export const Component: React.FC<StatusSuccessProps> = (props) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	const actions: StatusAction[] = props.actions ?? [
		{
			path: '/',
			label: 'Complete',
			variant: 'contained',
		},
	]

	return (
		<View style={componentStyles.screen} testID={props.testID}>
			<View style={componentStyles.card}>
				<View
					style={[componentStyles.iconWrap, { backgroundColor: withOpacity(String(colors.success), 0.12) }]}>
					<Icon name={`SyCheckRingRound`} size={38} color={`success`} />
				</View>
				<Text size={28} variant={`displayMedium`} style={componentStyles.title}>
					{props.title}
				</Text>
				{props.objectNumber ? (
					<Text size={12} style={componentStyles.objectNumber}>
						{props.objectNumber}
					</Text>
				) : null}
				{props.subTitle ? (
					<Text size={14} style={componentStyles.subTitle}>
						{props.subTitle}
					</Text>
				) : null}
				<View style={componentStyles.actions}>
					{actions.map((action, index) => (
						<Button
							key={`${action.label}-${index}`}
							mode={index === 0 ? `contained` : getButtonMode(action.variant)}
							size={`large`}
							variant={action.color || (index === 0 ? `success` : `primary`)}
							style={componentStyles.actionButton}
							onPress={async () => {
								if (action.onClick) {
									await action.onClick()
									return
								}
								if (action.path) {
									await props.onNavigate?.(action.path)
								}
							}}>
							{action.label || `Action ${index + 1}`}
						</Button>
					))}
				</View>
			</View>
		</View>
	)
}
