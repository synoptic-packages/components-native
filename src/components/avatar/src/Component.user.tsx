import { Image } from 'expo-image'
import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'

import { useTheme } from '../../../hooks/useTheme'
import { Icon } from '../../icon/index'
import { Loader } from '../../loader/index'
import { View } from '../../view/index'
import { styles } from './styles.user'

export interface ComponentProps {
	/** Resolved photo URL. Absent → `SyUserAlt` fallback icon. */
	avatarUrl?: string
	size?: number
	editable?: boolean
	/** Upload/remove in flight → loader replaces the picture. */
	uploading?: boolean
	onPress?: () => void
	testID?: string
}

/**
 * Signed-in user's avatar (presentational). Ported from ventry `avatar/user`,
 * which read the picture from Parse auth state and wrote through
 * `setProfileImage` + app snackbar/action-sheet context — all stripped.
 * The host owns the data journey and passes the resolved URL + handlers in.
 */
export const Component: React.FC<ComponentProps> = ({
	avatarUrl,
	size = 64,
	editable = false,
	uploading = false,
	onPress,
	testID = `avatar-user`,
}) => {
	const { colors, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	const borderRadius = size / 2

	const renderAvatarContent = () => {
		if (uploading) {
			return (
				<View
					style={[
						componentStyles.avatar,
						{
							width: size,
							height: size,
							borderRadius,
						},
					]}>
					<Loader size={Math.round(size * 0.4)} />
				</View>
			)
		}

		if (avatarUrl) {
			return (
				<Image
					contentFit={`cover`}
					style={[
						componentStyles.avatar,
						componentStyles.image,
						{
							width: size,
							height: size,
							borderRadius,
							backgroundColor: colors?.muted,
						},
					]}
					source={{ uri: avatarUrl }}
				/>
			)
		}

		return (
			<Avatar.Icon
				size={size}
				color={colors.text}
				icon={({ size: iconSize, color }) => (
					<Icon family={`Synotech`} name={`SyUserAlt`} size={iconSize} color={color} />
				)}
				style={[
					componentStyles.avatar,
					{
						width: size,
						height: size,
						borderRadius,
						backgroundColor: colors?.mutedLight,
					},
				]}
			/>
		)
	}

	return (
		<TouchableOpacity
			// Deterministic id so a flow can reach the avatar. There was none, which made the whole
			// picture journey undrivable — carried over from the ventry source comment.
			testID={testID}
			accessibilityLabel={editable ? `Change profile picture` : `Profile picture`}
			activeOpacity={0.8}
			onPress={onPress}
			style={[
				componentStyles.container,
				{
					width: size,
					height: size,
					minHeight: size,
					borderRadius,
				},
			]}>
			{renderAvatarContent()}
			{editable ? (
				<View
					style={[
						componentStyles.editBadge,
						{
							width: Math.max(size * 0.34, 22),
							height: Math.max(size * 0.34, 22),
							borderRadius: Math.max(size * 0.17, 11),
						},
					]}>
					<Icon family={`Lucide`} name={`Camera`} size={Math.max(size * 0.18, 12)} color={`bg`} />
				</View>
			) : null}
		</TouchableOpacity>
	)
}
