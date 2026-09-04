import { Icon, type IconFamily, type IconName } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import type { ColorName } from '../../../constants/index'
import React from 'react'

export interface ComponentProps {
	icon: IconName
	family?: IconFamily
	label?: string
	accessibilityLabel?: string
	circleColor?: ColorName
	iconColor?: ColorName
	labelColor?: ColorName
	size?: number
	disabled?: boolean
	badge?: string
	onPress?: () => void
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({
	icon,
	family = 'Synotech',
	label,
	accessibilityLabel,
	circleColor = 'primary',
	iconColor = 'white',
	labelColor = 'text',
	size = 52,
	disabled = false,
	badge,
	onPress,
	testID,
}) => {
	return (
		<Pressable
			testID={testID}
			accessibilityRole={`button`}
			accessibilityLabel={accessibilityLabel ?? label}
			alignItems={`center`}
			opacity={disabled ? 0.5 : 1}
			disabled={disabled}
			onPress={onPress}>
			<View>
				<View width={size} height={size} borderRadius={size / 2} flexCenter backgroundColor={circleColor}>
					<Icon family={family} name={icon} color={iconColor} size={Math.round(size * 0.54)} />
				</View>
				{badge ? (
					<View
						position={`absolute`}
						top={-4}
						right={-6}
						backgroundColor={`bgLighter`}
						borderRadius={8}
						paddingHorizontal={6}
						paddingVertical={1}
						borderWidth={1}
						borderColor={`divider`}>
						<Text fontSize={9} fontWeight={`700`} color={`muted`}>
							{badge}
						</Text>
					</View>
				) : null}
			</View>
			{label ? (
				<Text fontSize={12} color={labelColor} marginTop={6} numberOfLines={1}>
					{label}
				</Text>
			) : null}
		</Pressable>
	)
}
