import * as React from 'react'
import { type SetStateAction, useEffect } from 'react'
import { Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { deviceHeight, deviceWidth } from '../../../constants/index'
import { useTheme } from '../../../hooks/useTheme'
import { Icon } from '../../icon/index'
import { Loader } from '../../loader/index'
import { Text } from '../../text/index'
import { TouchableOpacity } from '../../touchable-opacity/index'
import { View } from '../../view/index'

interface ComponentProps {
	preview: string | null
	mode?: 'general' | 'selfie'
	accept: () => void
	clearPreview: () => void
	isUploading?: boolean
	setIsUploading: React.Dispatch<SetStateAction<boolean>>
	retryLabel?: string
	acceptLabel?: string
	uploadingLabel?: string
	guidance?: string
}

export const Component: React.FC<ComponentProps> = ({
	preview,
	mode,
	clearPreview,
	accept,
	setIsUploading,
	isUploading,
	retryLabel = `Retry`,
	acceptLabel = `Accept`,
	uploadingLabel = `Uploading`,
	guidance = `Please make sure that your face is in the frame and clearly visible`,
}) => {
	const { colors } = useTheme()
	const { top, bottom } = useSafeAreaInsets()
	const isSelfiePreview = mode === 'selfie'
	const maskSize = 260
	const footerBottomInset = bottom + 12
	const footerHeight = 60 + footerBottomInset
	const previewHeight = deviceHeight - (footerHeight + top)

	useEffect(() => {
		setIsUploading(false)
	}, [setIsUploading])

	return (
		<View backgroundColor={isSelfiePreview ? `white` : `black`} flex={1} width={deviceWidth} height={deviceHeight}>
			<View width={deviceWidth} height={previewHeight} overflow={`hidden`}>
				{isSelfiePreview ? (
					<React.Fragment>
						<View
							width={maskSize}
							height={maskSize + 160}
							position={`absolute`}
							top={180}
							left={deviceWidth / 2 - maskSize / 2}
							overflow={`hidden`}>
							<View
								width={maskSize}
								height={maskSize + 100}
								borderRadius={300}
								borderWidth={2}
								borderColor={`accent`}
								overflow={`hidden`}>
								{preview && (
									<Image
										source={{ uri: preview }}
										style={{
											width: maskSize,
											height: maskSize + 100,
										}}
									/>
								)}
							</View>
							<View height={16} />
							<Text color={`black`} lineHeight={19} align={`center`} opacity={0.6}>
								{guidance}
							</Text>
						</View>
					</React.Fragment>
				) : (
					preview && (
						<Image
							source={{ uri: preview }}
							style={{
								width: deviceWidth,
								height: previewHeight,
								borderBottomWidth: 1,
								borderColor: colors?.divider,
							}}
						/>
					)
				)}
			</View>
			<View
				paddingTop={16}
				paddingBottom={footerBottomInset}
				height={footerHeight}
				paddingHorizontal={32}
				flexDirection={`row`}
				justifyContent={`space-between`}>
				<TouchableOpacity
					disabled={isUploading}
					onPress={clearPreview}
					flexDirection={`row`}
					alignItems={`center`}
					height={52}
					opacity={isUploading ? 0.5 : 1}>
					<View
						width={52}
						height={52}
						borderRadius={26}
						justifyContent={`center`}
						backgroundColor={isUploading ? `bgLighter` : `error`}
						alignItems={`center`}>
						<Icon family={`MaterialIcons`} name={`undo`} size={32} color={`white`} />
					</View>
					<Text marginLeft={8} color={isSelfiePreview ? `black` : `white`} fontSize={16}>
						{retryLabel}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					disabled={isUploading}
					onPress={accept}
					flexDirection={`row`}
					alignItems={`center`}
					height={52}>
					<View
						width={52}
						height={52}
						borderRadius={26}
						opacity={isUploading ? 0.7 : 1}
						backgroundColor={`success`}
						justifyContent={`center`}
						alignItems={`center`}>
						{isUploading ? (
							<Loader color={`white`} size={32} />
						) : (
							<Icon family={`MaterialIcons`} name={`check`} size={32} color={`white`} />
						)}
					</View>
					<Text
						marginLeft={8}
						color={isSelfiePreview ? `black` : `white`}
						fontSize={16}
						opacity={isUploading ? 0.4 : 1}>
						{isUploading ? uploadingLabel : acceptLabel}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
