import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { useCallback } from 'react'
import { Image, useWindowDimensions } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { Pagination } from 'react-native-reanimated-carousel'
import { styles } from './styles'

export type PreauthSlide = {
	graphic: { uri: string }
	title: string
	subtitle: string
}

type ComponentProps = {
	slides: PreauthSlide[]
}

export function Component({ slides }: ComponentProps) {
	const { width } = useWindowDimensions()
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const progress = useSharedValue(0)

	const renderSlide = useCallback(
		({ item }: { item: PreauthSlide }) => {
			return (
				<View flex={1}>
					<View flex={2} style={componentStyles.graphicContainer}>
						{item.graphic?.uri ? (
							<Image
								source={{ uri: item.graphic.uri }}
								style={componentStyles.graphicImage}
								resizeMode={`cover`}
							/>
						) : (
							<View flex={1} flexCenter backgroundColor={`bgLighter`} />
						)}
					</View>
					<View flex={1} flexCenter paddingHorizontal={24}>
						<Text variant={`displayMedium`} align={`center`}>
							{item.title}
						</Text>
						<Text variant={`bodyLarge`} color={`muted`} align={`center`} marginTop={8}>
							{item.subtitle}
						</Text>
					</View>
				</View>
			)
		},
		[componentStyles.graphicContainer, componentStyles.graphicImage]
	)

	return (
		<>
			<View flex={1}>
				<Carousel
					data={slides}
					width={width}
					renderItem={renderSlide}
					loop={false}
					onProgressChange={progress}
				/>
			</View>
			<View paddingTop={8}>
				<Pagination.Basic
					progress={progress}
					data={slides}
					dotStyle={componentStyles.dotInactive}
					activeDotStyle={componentStyles.dotActive}
					containerStyle={componentStyles.dotContainer}
				/>
			</View>
		</>
	)
}
