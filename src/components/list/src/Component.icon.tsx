import { Icon, type IconFamily, type IconName, type IconProps } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import * as React from 'react'

import { styles } from './styles.icon'

export interface ComponentProps {
	children?: React.ReactNode
	name: IconName
	family?: IconFamily
	color?: IconProps['color']
	size?: number
	strokeWidth?: number
	onPress?: () => void
	disabled?: boolean
}

export const Component: React.FC<ComponentProps> = ({
	name,
	family = 'Lucide',
	color = 'muted',
	size = 20,
	strokeWidth = 1.5,
	onPress,
	disabled,
	children,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	if (children) {
		if (onPress) {
			return (
				<Pressable onPress={onPress} disabled={disabled} style={componentStyles.container}>
					{children}
				</Pressable>
			)
		}

		return <View style={componentStyles.container}>{children}</View>
	}

	return (
		<Icon
			family={family}
			name={name}
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			onPress={onPress}
			disabled={disabled}
			backgroundStyle={componentStyles.container}
		/>
	)
}
