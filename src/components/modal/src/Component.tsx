import React from 'react'
import RNModal from 'react-native-modal'
import { deviceHeight, deviceWidth } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'

interface Props {
	isVisible: boolean
	onBackdropPress?: () => void
	setIsVisible?: (_: boolean) => void
	onModalHide?: () => void
	children: React.ReactNode
	testID?: string
}

export const Component: React.FC<Props> = ({
	isVisible,
	setIsVisible,
	onBackdropPress,
	onModalHide,
	children,
	testID,
}) => {
	const { colors } = useTheme()

	return (
		<RNModal
			testID={testID}
			isVisible={isVisible}
			onBackdropPress={onBackdropPress}
			onModalHide={() => {
				onModalHide && onModalHide()
				setIsVisible && setIsVisible(false)
			}}
			onBackButtonPress={() => {
				setIsVisible && setIsVisible(false)
			}}
			style={{ margin: 0, width: deviceWidth, height: deviceHeight }}
			backdropColor={colors?.modalOpacity}
			backdropOpacity={0.8}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			animationIn={`slideInUp`}
			animationOut={`slideOutDown`}
			animationInTiming={300}
			animationOutTiming={300}
			hideModalContentWhileAnimating={true}
			useNativeDriverForBackdrop={true}>
			{children}
		</RNModal>
	)
}
