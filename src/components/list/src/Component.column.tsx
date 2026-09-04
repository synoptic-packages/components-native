import { useTheme } from '../../../hooks/useTheme'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { View } from '../../view'
import { styles } from './styles.column'

export interface ComponentColumnProps {
	children?: React.ReactNode
	style?: StyleProp<ViewStyle>
}

export const Component: React.FC<ComponentColumnProps> = ({ children, style }) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	return <View style={style ? [componentStyles.container, style] : componentStyles.container}>{children}</View>
}
