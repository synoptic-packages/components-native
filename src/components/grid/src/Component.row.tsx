import * as React from 'react'

import type { TGeneric } from '../../../types'
import { ErrorBoundary } from '../../error-boundary'
import { View, ViewProps } from '../../view'

export type ComponentProps = ViewProps & {
	gap?: number
	children: React.ReactNode
}

export const Component: React.FC<ComponentProps | TGeneric> = (props) => {
	const { children, style, gap = 1 } = props
	const columns = React.Children.count(children)
	return (
		<ErrorBoundary>
			<View
				width={`100%`}
				flexDirection={`row`}
				alignContent={`space-between`}
				minWidth={`100%`}
				style={style}
				{...props}>
				{React.Children.map(children, (child, id) => {
					return React.cloneElement(child, {
						style: {
							paddingLeft: id === 0 ? 0 : gap / 2,
							paddingRight: id === columns - 1 ? 0 : gap / 2,
							flexBasis: 100 / columns,
							flexGrow: 1,
							flexShrink: 1,
							...child.props.style,
						},
					})
				})}
			</View>
		</ErrorBoundary>
	)
}
