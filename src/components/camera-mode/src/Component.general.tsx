import { CameraView } from 'expo-camera'
import * as React from 'react'
import { type RefObject } from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { deviceHeight, deviceWidth, zIndex } from '../../../constants/index'
import { Icon } from '../../icon/index'
import { TouchableOpacity } from '../../touchable-opacity/index'
import { View } from '../../view/index'

interface ComponentProps {
	facing: 'front' | 'back'
	cameraRef: RefObject<CameraView | null> | null
	isActive: boolean
	torch: 'on' | 'off'
	toggleTorch: () => void
	onCapture: () => void
	flipCamera: () => void
	onClose: () => void
}

export const Component: React.FC<ComponentProps> = ({
	facing,
	cameraRef,
	isActive,
	torch,
	toggleTorch,
	onClose,
	onCapture,
	flipCamera,
}) => {
	const { top, bottom } = useSafeAreaInsets()

	return (
		<View flex={1} backgroundColor={`black`} width={deviceWidth} height={deviceHeight}>
			<CameraView
				ref={cameraRef}
				style={StyleSheet.absoluteFill}
				facing={facing}
				active={isActive}
				enableTorch={torch === 'on'}
			/>
			<Icon
				family={`Ionicons`}
				name={`arrow-back-sharp`}
				color={`white`}
				size={28}
				onPress={onClose}
				style={{
					position: `absolute`,
					left: 20,
					top: top + 20,
					zIndex: 10000,
				}}
			/>

			<View
				position={`absolute`}
				flexDirection={`row`}
				justifyContent={`space-between`}
				right={20}
				top={top + 20}
				zIndex={10000}>
				<Icon
					family={`Ionicons`}
					name={torch ? `flash` : `flash-off`}
					color={`white`}
					size={24}
					onPress={toggleTorch}
					style={{
						marginRight: 20,
					}}
				/>
				<Icon
					family={`Ionicons`}
					name={`camera-reverse-outline`}
					color={`white`}
					size={24}
					onPress={flipCamera}
				/>
			</View>

			<View
				position={`absolute`}
				width={deviceWidth}
				paddingHorizontal={20}
				bottom={bottom + 54}
				height={100}
				left={0}
				right={0}
				zIndex={zIndex.modalOverlayMax}
				flexCenter={true}>
				<TouchableOpacity onPress={onCapture}>
					<Icon family={`MaterialCommunityIcons`} name={`circle-slice-8`} color={`white`} size={80} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
