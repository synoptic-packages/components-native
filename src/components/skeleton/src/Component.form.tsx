import { useTheme } from '../../../hooks/useTheme'
import { Skeleton } from 'moti/skeleton'
import * as React from 'react'
import { input } from '../../../constants'
import { ErrorBoundary } from '../../error-boundary'
import { View } from '../../view'
import { styles } from './styles.form'

export const Component: React.FC<any> = ({ style, isLoading }) => {
	const { colorScheme } = useTheme()
	return (
		<ErrorBoundary>
			<View style={[styles?.skeleton, style]}>
				<Skeleton
					show={isLoading}
					height={input.height}
					width={'100%'}
					colorMode={colorScheme}
					radius={input.borderRadius}
				/>
				<View width={'100%'} height={12} />
				<Skeleton
					show={isLoading}
					height={input.height}
					width={'100%'}
					colorMode={colorScheme}
					radius={input.borderRadius}
				/>
				<View width={'100%'} height={12} />
				<View style={styles?.checkboxRow}>
					<Skeleton
						show={isLoading}
						height={input.height / 2}
						width={input.height / 2}
						colorMode={colorScheme}
						radius={input.height}
					/>
					<View width={12} height={12} />
					<Skeleton
						show={isLoading}
						height={input.height / 4}
						width={input.height * 2}
						colorMode={colorScheme}
						radius={input.height}
					/>
					<View width={12} height={12} />
					<Skeleton
						show={isLoading}
						height={input.height / 2}
						width={input.height / 2}
						colorMode={colorScheme}
						radius={input.height}
					/>
					<View width={12} height={12} />
					<Skeleton
						show={isLoading}
						height={input.height / 4}
						width={input.height * 2}
						colorMode={colorScheme}
						radius={input.height}
					/>
				</View>
			</View>
		</ErrorBoundary>
	)
}

Component.displayName = 'SkeletonForm'
