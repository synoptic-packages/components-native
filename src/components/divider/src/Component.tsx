import * as React from 'react'

import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { ErrorBoundary } from '../../error-boundary'
import { Text } from '../../text'
import { View, type ViewProps } from '../../view'
import { getContainerStyle, getLineStyle, styles } from './styles'

export type ComponentProps = {
	style?: ViewProps['style']
	color?: ColorName
	title?: string
	height?: number
} & Omit<ViewProps, 'style'>

export const Component: React.FC<ComponentProps> = ({ color = `muted`, title = ``, height = 15, style, ...props }) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const containerStyle = React.useMemo(() => getContainerStyle(height), [height])
	const lineStyle = React.useMemo(() => getLineStyle(String(colors[color])), [color, colors])

	return (
		<ErrorBoundary>
			<View {...props} style={[componentStyles.container, containerStyle, style]}>
				<View style={lineStyle} />
				{title && (
					<Text variant={`labelMedium`} style={componentStyles.title}>
						{title}
					</Text>
				)}
				<View style={lineStyle} />
			</View>
		</ErrorBoundary>
	)
}
