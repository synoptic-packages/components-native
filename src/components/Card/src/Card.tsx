import { ScrollView } from '../../scroll-view/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { styles } from './styles'
import type { ComponentProps } from './types'

export const Component: React.FC<ComponentProps> = ({
	header,
	footer,
	children,
	height = 1,
	backgroundColor,
	style,
	testID,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	const dynamicStyles = setStylesheet({
		container: {
			backgroundColor: backgroundColor || 'bgLighter',
		},
	})

	const containerHeight = typeof height === 'number' ? height : undefined
	const containerStyle = {
		...componentStyles.container,
		...dynamicStyles.container,
		...(containerHeight ? { minHeight: containerHeight } : { flex: 1 }),
	}

	const hasHeaderOrFooter = !!header || !!footer
	const bodyStyle = {
		...componentStyles.bodyContainer,
		...(hasHeaderOrFooter ? { flex: 1 } : {}),
	}

	return (
		<View style={[containerStyle, style]} testID={testID}>
			{header && <View style={componentStyles.headerContainer}>{header}</View>}

			{hasHeaderOrFooter ? (
				<ScrollView
					style={bodyStyle}
					contentContainerStyle={componentStyles.bodyContent}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}>
					{children}
				</ScrollView>
			) : (
				<View style={bodyStyle}>{children}</View>
			)}

			{footer && <View style={componentStyles.footerContainer}>{footer}</View>}
		</View>
	)
}
