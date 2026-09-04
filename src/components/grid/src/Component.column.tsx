import * as React from 'react'

import { ErrorBoundary } from '../../error-boundary'
import { View, ViewProps } from '../../view'

export const Component: React.FC<ViewProps> = (props) => {
	const { children, style = {} } = props

	return (
		<ErrorBoundary>
			<View style={[styles.container, style]} {...props}>
				{children}
			</View>
		</ErrorBoundary>
	)
}

const styles = {
	container: {},
}
