import { ScrollView } from '../../scroll-view/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import React, { type ReactNode } from 'react'
import { Component as SectionHeader } from './Component.header'
import { styles } from './styles'

export interface ComponentProps {
	title: string
	onPressAction?: () => void
	actionTestID?: string
	testID?: string
	marginTop?: number
	children: ReactNode
}

export const Component: React.FC<ComponentProps> = ({
	title,
	onPressAction,
	actionTestID,
	testID,
	marginTop = 0,
	children,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	return (
		<View testID={testID} marginTop={marginTop}>
			<SectionHeader title={title} onPressAction={onPressAction} actionTestID={actionTestID} />
			<ScrollView
				horizontal
				transparent
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={componentStyles.content}>
				{children}
			</ScrollView>
		</View>
	)
}
