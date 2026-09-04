import * as React from 'react'
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '../../button/index'
import { Icon } from '../../icon/index'
import { ScrollView } from '../../scroll-view/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { FormHeaderContext } from './context'
import { styles } from './styles.modal'
import type { FormHeaderAction } from './types'

interface ComponentProps {
	asModal?: boolean
	open: boolean
	onClose?: () => void
	title: string
	name: string
	headerAction?: FormHeaderAction
	children: React.ReactNode
}

const MODAL_TOP_GAP = 24

export const Component: React.FC<ComponentProps> = ({
	// asModal,
	open,
	onClose,
	title,
	name,
	headerAction,
	children,
}) => {
	const { colors, setStylesheet } = useTheme()
	const { height: deviceHeight } = useWindowDimensions()
	const { bottom, top } = useSafeAreaInsets()
	const componentStyles = setStylesheet(styles)
	const sheetHeight = Math.max(0, deviceHeight - (top + MODAL_TOP_GAP))
	const [registeredAction, setRegisteredAction] = React.useState<FormHeaderAction | null>(null)
	const headerContext = React.useMemo(() => ({ setHeaderAction: setRegisteredAction }), [])
	const effectiveHeaderAction = headerAction ?? registeredAction

	return (
		<Modal
			animationType={`slide`}
			transparent={true}
			statusBarTranslucent={true}
			visible={open}
			onRequestClose={onClose}>
			<View style={componentStyles.overlay}>
				<Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
				<View
					style={[
						componentStyles.sheet,
						{
							height: sheetHeight,
							backgroundColor: String(colors.bg),
							paddingBottom: Math.max(bottom, 18),
						},
					]}>
					<View style={[componentStyles.header, { borderBottomColor: String(colors.divider) }]}>
						{onClose ? (
							<Pressable
								testID={`${name}-form-modal-close`}
								accessibilityRole={`button`}
								accessibilityLabel={`Close ${title}`}
								onPress={onClose}
								style={({ pressed }) => [
									componentStyles.closeButton,
									pressed && componentStyles.pressed,
								]}>
								<Icon family={`MaterialCommunityIcons`} name={`close`} size={22} color={`text`} />
							</Pressable>
						) : (
							<View style={componentStyles.closeButtonSpacer} />
						)}
						<View style={componentStyles.titleContainer}>
							{/* The face comes from the PROP, not the style file: `Text` derives display tracking
							    from the family it is told about, and a `fontFamily` smuggled in through `style`
							    is invisible to it. */}
							<Text size={20} fontFamily={`display`} style={componentStyles.title} numberOfLines={1}>
								{title}
							</Text>
						</View>
						{effectiveHeaderAction ? (
							<Button
								testID={`${name}-form-modal-submit`}
								mode={`contained`}
								size={`small`}
								compact={true}
								loading={effectiveHeaderAction.loading}
								disabled={effectiveHeaderAction.disabled}
								onPress={effectiveHeaderAction.onPress}
								accessibilityLabel={effectiveHeaderAction.accessibilityLabel ?? `Submit ${title}`}
								style={componentStyles.submitButton}>
								{effectiveHeaderAction.label}
							</Button>
						) : null}
					</View>
					<ScrollView
						style={componentStyles.scroll}
						contentContainerStyle={componentStyles.scrollContent}
						keyboardShouldPersistTaps={`handled`}
						showsVerticalScrollIndicator={false}
						testID={`${name}-form-modal`}>
						<View height={16} />
						<FormHeaderContext.Provider value={headerContext}>{children}</FormHeaderContext.Provider>
					</ScrollView>
				</View>
			</View>
		</Modal>
	)
}

Component.displayName = 'FormModal'
