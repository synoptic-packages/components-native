import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import * as React from 'react'
import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import { Component as ListItemComponent } from './Component'
import { styles } from './styles.card'

export interface ComponentCardProps {
	title?: string
	footer?: ReactNode
	children: ReactNode
	disabled?: boolean
	contentStyle?: StyleProp<ViewStyle>
}

const countListItems = (children: ReactNode): number => {
	let count = 0

	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) {
			return
		}

		if (child.type === React.Fragment) {
			const fragment = child as React.ReactElement<{ children?: ReactNode }>
			count += countListItems(fragment.props.children)
			return
		}

		if (child.type === ListItemComponent) {
			count += 1
		}
	})

	return count
}

export const Component: React.FC<ComponentCardProps> = ({ title, footer, children, disabled, contentStyle }) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const shouldApplyListPadding = countListItems(children) >= 2

	return (
		<View style={componentStyles.wrapper}>
			{title ? (
				<Text variant={`labelSmall`} style={componentStyles.title}>
					{title}
				</Text>
			) : null}
			<View
				pointerEvents={disabled ? `none` : `auto`}
				style={[
					componentStyles.card,
					shouldApplyListPadding ? componentStyles.cardListPadding : null,
					disabled ? componentStyles.disabled : null,
					contentStyle,
				]}>
				{children}
			</View>
			{footer ? (
				typeof footer === 'string' ? (
					<Text variant={`bodySmall`} style={componentStyles.footer}>
						{footer}
					</Text>
				) : (
					<View style={componentStyles.footer}>{footer}</View>
				)
			) : null}
		</View>
	)
}
