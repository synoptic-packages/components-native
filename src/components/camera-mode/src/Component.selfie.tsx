import { CameraView } from 'expo-camera'
import * as React from 'react'
import { type RefObject } from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { deviceHeight, deviceWidth, zIndex } from '../../../constants/index'
import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import { TouchableOpacity } from '../../touchable-opacity/index'
import { View } from '../../view/index'

interface ComponentProps {
	facing: 'front' | 'back'
	cameraRef: RefObject<CameraView | null> | null
	isActive: boolean
	onCapture: () => void
	onClose: () => void
	/**
	 * Watermark shown above the capture button. The ventry source rendered
	 * `BrandLogo` (app-owned assets); the library takes a node.
	 */
	brand?: React.ReactNode
	title?: string
	guidance?: string
}

export const Component: React.FC<ComponentProps> = ({
	facing,
	cameraRef,
	isActive,
	onClose,
	onCapture,
	brand,
	title = `Take a Selfie`,
	guidance = `Please make sure that your face is in the frame and clearly visible`,
}) => {
	const { top, bottom } = useSafeAreaInsets()
	const maskSize = 260

	return (
		<View flex={1} backgroundColor={`white`} width={deviceWidth} height={deviceHeight}>
			<React.Fragment>
				<View
					width={maskSize}
					height={maskSize + 160}
					position={`absolute`}
					top={180}
					left={deviceWidth / 2 - maskSize / 2}
					zIndex={zIndex.modalOverlayHigh}
					overflow={`hidden`}>
					<View
						width={maskSize}
						height={maskSize + 100}
						zIndex={zIndex.modalOverlayHigh}
						borderRadius={300}
						borderWidth={2}
						borderColor={`accent`}
						overflow={`hidden`}>
						<CameraView
							ref={cameraRef}
							style={StyleSheet.absoluteFill}
							facing={facing}
							active={isActive}
							enableTorch={false}
							pointerEvents={`none`}
						/>
					</View>
					<View height={16} />
					<Text color={`black`} lineHeight={19} align={`center`} opacity={0.6}>
						{guidance}
					</Text>
				</View>
			</React.Fragment>
			<View
				width={deviceWidth}
				height={60}
				position={`absolute`}
				flexDirection={`row`}
				justifyContent={`space-between`}
				top={top + 8}
				left={0}
				right={0}
				padding={18}>
				<Icon family={`Ionicons`} name={`arrow-back-sharp`} color={`black`} size={28} onPress={onClose} />
				<Text variant={`titleLarge`} color={`black`}>
					{title}
				</Text>
			</View>

			<View
				position={`absolute`}
				flexDirection={`row`}
				width={deviceWidth}
				paddingHorizontal={20}
				bottom={bottom + 12}
				height={100}
				left={0}
				right={0}
				opacity={0.64}
				zIndex={99999999}
				flexCenter={true}>
				{brand}
			</View>

			<View
				position={`absolute`}
				width={deviceWidth}
				paddingHorizontal={20}
				bottom={bottom + 64}
				height={100}
				left={0}
				right={0}
				zIndex={99999999}
				flexCenter={true}>
				<TouchableOpacity onPress={onCapture}>
					<Icon family={`MaterialCommunityIcons`} name={`circle-slice-8`} color={`black`} size={80} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
