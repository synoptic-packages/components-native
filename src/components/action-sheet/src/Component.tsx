import * as React from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { md } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { ActionSheetProps, type TGeneric } from '../../../types'
import { ErrorBoundary } from '../../error-boundary'
import { Icon } from '../../icon'
import { ListItem } from '../../list'
import { Modal } from '../../modal'
import { Text } from '../../text'
import { View } from '../../view'
import { styles } from './styles'

export const ActionSheetEmpty: ActionSheetProps = {
	isOpen: false,
	setOpen: null,
	title: '',
	actions: [],
}

interface ComponentProps extends ActionSheetProps {}

export const Component: React.FC<ComponentProps> = ({ isOpen, setOpen, title, actions = [] }) => {
	const actionsArray = [
		...actions,
		{
			title: `Cancel`,
			left: <Icon family={`Ionicons`} name={`stop-circle`} size={36} color={`muted`} />,
			right: <Icon family={'SimpleLineIcons'} name={'arrow-right'} size={14} color={`muted`} />,
			onPress: () => setOpen(ActionSheetEmpty),
		},
	]
	const { colors, setStylesheet } = useTheme()
	const insets = useSafeAreaInsets()
	const actionSheetStyles = setStylesheet(styles)

	const close = () => setOpen(ActionSheetEmpty)

	return (
		<ErrorBoundary>
			{isOpen && (
				<Modal isVisible={isOpen} onBackdropPress={close}>
					<View style={actionSheetStyles.container}>
						<View style={{ flex: 1 }} />
						<View style={[actionSheetStyles.content, { backgroundColor: colors?.bgLighter }]}>
							<View style={actionSheetStyles.contentInner}>
								<View
									flexDirection={`row`}
									alignItems={`center`}
									justifyContent={`space-between`}
									width={`100%`}
									paddingHorizontal={md}
									height={60}>
									{title ? (
										<Text
											variant={`titleLarge`}
											color={`muted`}
											align={`center`}
											fontFamily={`regular`}>
											{title}
										</Text>
									) : (
										<View />
									)}
								</View>

								<View width={`100%`} paddingBottom={insets?.bottom}>
									{actionsArray?.map((action: TGeneric, i) => (
										<ListItem
											key={i}
											left={action?.left}
											height={52}
											title={action?.title}
											titleVariant={`titleMedium`}
											subTitle={action?.subTitle}
											onPress={action?.onPress}
											isLast={i === actionsArray?.length - 1}
										/>
									))}
								</View>
							</View>
						</View>
					</View>
				</Modal>
			)}
		</ErrorBoundary>
	)
}
