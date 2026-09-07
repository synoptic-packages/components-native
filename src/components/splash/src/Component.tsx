import React, { useEffect, useRef, useState } from 'react'

import { useTheme } from '../../../hooks/useTheme'
import { Button } from '../../button/index'
import { ErrorBoundary } from '../../error-boundary/index'
import { Loader } from '../../loader/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'

export type ComponentProps = {
	message?: string
	/**
	 * Brand mark shown above the loader. The ventry source rendered its own
	 * `BrandLogo` (app-owned PNG assets); the library takes a node so hosts
	 * keep owning their brand.
	 */
	brand?: React.ReactNode
	/**
	 * Fires from the Refresh button, which appears after 30s without progress
	 * (stuck-bundle escape hatch, carried over from ventry). Defaults to a
	 * no-op when the host wires nothing.
	 */
	onRetry?: () => void | Promise<void>
	/** Seconds before the Refresh button appears. Default 30 (ventry value). */
	retryAfterSeconds?: number
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({
	message,
	brand,
	onRetry,
	retryAfterSeconds = 30,
	testID,
}) => {
	const { colors } = useTheme()
	const [showButton, setShowButton] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		timerRef.current = setTimeout(() => {
			setShowButton(true)
		}, retryAfterSeconds * 1000)
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		}
	}, [retryAfterSeconds])

	return (
		<ErrorBoundary>
			<View backgroundColor={'primary'} flex={1} flexCenter={true} flexDirection={`column`} testID={testID}>
				<View flexCenter={true} flexDirection={`column`}>
					{brand}
					{brand ? <View height={20} /> : null}
					{message && (
						<Text color={'white'} align={`center`} bold={true} opacity={0.7}>
							{message}
						</Text>
					)}
					<View height={100} />
					<Loader color={colors.white} size={32} />
					{showButton && (
						<>
							<View height={20} />
							<View flexCenter={true}>
								<Button
									size={`small`}
									mode={`contained`}
									variant={`accent`}
									style={{ width: 160 }}
									onPress={() => onRetry?.()}>
									Refresh
								</Button>
							</View>
						</>
					)}
				</View>
			</View>
		</ErrorBoundary>
	)
}
