import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from 'react-native-reanimated'
import { G, Path, Svg } from 'react-native-svg'
import { styles } from './styles'

const ARC_PATH =
	'M4.295 0A4.233 4.233 0 001.24 1.24l.75.75a3.175 3.175 0 012.243-.932 3.175 3.175 0 012.244.932l.75-.75A4.233 4.233 0 004.295 0z'
const VIEWBOX_SIZE = 8.4666664
const RING_COUNT = 5
const DURATION = 1200
const MIN_DELAY = 150
const MAX_DELAY = 445

export interface ComponentProps {
	color?: ColorName | string
	size?: number
}

function getDelay(index: number): number {
	if (index === 0) return 0
	const factor = (MAX_DELAY - MIN_DELAY) / (RING_COUNT - 2)
	return Math.round(MIN_DELAY + (index - 1) * factor)
}

function RingArc({ color, size, delay }: { color: string; size: number; delay: number }) {
	const rotation = useSharedValue(0)

	useEffect(() => {
		rotation.value = withDelay(
			delay,
			withRepeat(
				withTiming(360, {
					duration: DURATION,
					easing: Easing.bezier(0.5, 0.01, 0.5, 1),
				}),
				-1
			)
		)
	}, [delay, rotation])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}))

	return (
		<Animated.View
			style={[
				{
					position: 'absolute',
					width: size,
					height: size,
				},
				animatedStyle,
			]}>
			<Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
				<G>
					<Path fill={color} d={ARC_PATH} />
				</G>
			</Svg>
		</Animated.View>
	)
}

export const Component: React.FC<ComponentProps> = ({ color, size = 32 }) => {
	const { colors } = useTheme()
	const resolvedColor = color && color in colors ? colors[color as ColorName] : color || colors.primary

	return (
		<View style={[styles.container, { width: size, height: size }]}>
			{Array.from({ length: RING_COUNT }, (_, i) => (
				<RingArc key={i} color={String(resolvedColor)} size={size} delay={getDelay(i)} />
			))}
		</View>
	)
}
