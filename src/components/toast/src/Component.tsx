import { Loader } from '../../loader/index'
import * as React from 'react'
import { ReactNode } from 'react'
import Toast, { BaseToastProps, ToastPosition, ToastProps, ToastShowParams } from 'react-native-toast-message'

import { useTheme } from '../../../hooks/useTheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../../icon'
import { Text } from '../../text'
import { View } from '../../view'
import { styles } from './styles'
import { truncate } from '../../../lib/string'

export type ToastType = 'info' | 'error' | 'warning' | 'success'

export type ToastConfig = Record<ToastType, (props: BaseToastProps) => ReactNode>

export type ToastNotificationProps = {
	position?: ToastPosition
	type?: string
	message?: string
}

export const ToastEmptyPropsTemplate = {}

function createToastConfig(componentStyles: any, colors: any): ToastConfig | any {
	function IconWrapper({ children, style }: { children: ReactNode; style?: any }) {
		return <View style={[componentStyles.icon, style]}>{children}</View>
	}

	return {
		info: (options: any) => {
			const { message } = options.props
			return (
				<View style={[componentStyles.container, { borderColor: colors.primary }]}>
					<IconWrapper>
						<Icon
							family={'MaterialCommunityIcons'}
							name={'exclamation-thick'}
							color={`primary`}
							size={24}
						/>
					</IconWrapper>
					<Text bold={true} style={componentStyles.message}>
						{truncate(message)}
					</Text>
				</View>
			)
		},
		error: (options: any) => {
			const { message } = options.props
			return (
				<View style={[componentStyles.container, { borderColor: colors.error }]}>
					<IconWrapper>
						<Icon family={'Ionicons'} name={'triangle'} size={28} color={`error`} />
					</IconWrapper>
					<Text bold={true} style={componentStyles.message}>
						{truncate(message)}
					</Text>
				</View>
			)
		},
		success: (options: any) => {
			const { message } = options.props
			return (
				<View style={[componentStyles.container, { borderColor: colors.success }]}>
					<IconWrapper>
						<Icon family={'Feather'} name={'check'} size={28} color={`success`} />
					</IconWrapper>
					<Text bold={true} style={componentStyles.message}>
						{truncate(message)}
					</Text>
				</View>
			)
		},
		warning: (options: any) => {
			const { message } = options.props
			return (
				<View style={[componentStyles.container, { borderColor: colors.warning }]}>
					<IconWrapper>
						<Icon family={'Ionicons'} name={'warning'} size={28} color={`warning`} />
					</IconWrapper>
					<Text bold={true} style={componentStyles.message}>
						{truncate(message)}
					</Text>
					<View style={componentStyles.rightArrow}>
						<Icon family={'AntDesign'} name={'right'} size={14} />
					</View>
				</View>
			)
		},
		loading: (options: any) => {
			const { message } = options.props
			return (
				<View style={[componentStyles.container, { borderColor: colors.primary }]}>
					<IconWrapper style={{ backgroundColor: colors.bg }}>
						<Loader size={24} color={colors.primary} />
					</IconWrapper>
					<Text bold={true} style={componentStyles.message}>
						{truncate(message)}
					</Text>
				</View>
			)
		},
	}
}

export type ToastWrapperShowParams = ToastShowParams & {
	position?: string
	delay?: number
	type?: ToastType
}

function ToastInstance(props: ToastProps) {
	const { colors, setStylesheet } = useTheme()
	const { top } = useSafeAreaInsets()
	const componentStyles = setStylesheet(styles)
	const toastConfig = React.useMemo(() => createToastConfig(componentStyles, colors), [componentStyles, colors])

	return (
		<Toast
			type={`info`}
			position={`top`}
			visibilityTime={6000}
			config={toastConfig}
			keyboardOffset={12}
			topOffset={top + 10}
			{...props}
		/>
	)
}

export default ToastInstance
