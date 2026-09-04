import * as React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Modal } from '../../modal/index'
import { Text } from '../../text/index'
import type { PopupProps } from '../../../types'
import { useTheme } from '../../../hooks/useTheme'
import { ErrorBoundary } from '../../error-boundary'
import { Icon } from '../../icon'
import { TouchableOpacity } from '../../touchable-opacity'
import { View } from '../../view'
import { styles } from './styles'

export const ComponentEmpty: PopupProps = {
	isOpen: false,
	title: '',
	message: '',
	description: '',
	cta: null,
	variant: 'info',
}

interface ComponentProps extends PopupProps {
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({
	isOpen,
	setOpen,
	title,
	message,
	description,
	cta,
	style,
	variant,
	testID,
}) => {
	const { colors, setStylesheet } = useTheme()
	const insets = useSafeAreaInsets()
	const componentStyles = setStylesheet(styles)

	return (
		<ErrorBoundary>
			{ComponentEmpty?.isOpen ||
				(isOpen && (
					<Modal
						isVisible={isOpen}
						onModalHide={() => {
							setOpen(ComponentEmpty)
						}}>
						<View style={componentStyles.container} testID={testID}>
							<View style={{ flex: 1 }} />
							<View
								style={[
									componentStyles.content,
									{ minHeight: 450, backgroundColor: colors?.bgLighter },
									style,
								]}>
								<TouchableOpacity
									style={componentStyles.closeButton}
									onPress={() => setOpen(ComponentEmpty)}>
									<Icon family={'MaterialCommunityIcons'} name={'close'} size={28} />
								</TouchableOpacity>
								<View style={componentStyles.contentInner}>
									{variant === 'info' && (
										<Icon
											family={'MaterialCommunityIcons'}
											name={'information'}
											color={`info`}
											size={60}
										/>
									)}
									{variant === 'warning' && (
										<Icon family={'Entypo'} name={'warning'} size={50} color={`warning`} />
									)}
									{variant === 'error' && (
										<Icon
											family={'MaterialCommunityIcons'}
											name={'triangle'}
											size={60}
											color={`error`}
										/>
									)}
									{variant === 'success' && (
										<Icon
											family={'MaterialCommunityIcons'}
											name={'check'}
											size={60}
											color={`success`}
										/>
									)}
									{title && (
										<Text variant={`titleLarge`} align={`center`}>
											{title}
										</Text>
									)}
									<View height={15} />
									{message && (
										<View justifyContent={`center`} paddingHorizontal={30}>
											<Text
												variant={`bodyMedium`}
												fontFamily={`regular`}
												style={{
													marginBottom: 10,
													textAlign: 'center',
													maxWidth: 300,
												}}>
												{message}
											</Text>
										</View>
									)}
									{description && (
										<View justifyContent={`center`} style={[{ paddingHorizontal: 30 }]}>
											<Text
												color={`muted`}
												style={{
													textAlign: 'center',
													maxWidth: 300,
												}}>
												{description}
											</Text>
										</View>
									)}
								</View>
								<View height={10} />
								<View style={[componentStyles.footer, { height: cta ? 180 : 90 + insets?.bottom }]}>
									{cta}
									<View height={10} />
								</View>
							</View>
						</View>
					</Modal>
				))}
		</ErrorBoundary>
	)
}
