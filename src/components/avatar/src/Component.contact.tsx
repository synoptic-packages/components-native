import * as React from 'react'
import { Avatar } from 'react-native-paper'

import { initials } from '../../../lib/string'
import { Loader } from '../../loader/index'
import { TouchableOpacity } from '../../touchable-opacity/index'

export interface ComponentProps {
	/** Display name → initials fallback when no photo resolves. */
	name?: string
	/**
	 * A resolved photo URL, preferred over anything probed off `contact`.
	 * (Ventry source comment, kept: the legacy `profileImage.files.url` /
	 * `profile_image_url` probes stay for old shapes, but a Parse-native
	 * caller passes the plain File URL here.)
	 */
	avatarUrl?: string
	/** Legacy contact shapes probed for a photo URL (retired Django vocabulary). */
	contact?: {
		firstName?: string
		lastName?: string
		user_name?: string
		name?: string
		profile_image_url?: string
		profileImage?: { files?: { url?: string } }
	} | null
	size?: number
	editable?: boolean
	uploading?: boolean
	onPress?: () => void
	onPickImage?: () => void | Promise<void>
	testID?: string
}

/**
 * Contact avatar: photo → initials → generic icon. Ported from ventry
 * `avatar/contact`; the picker/upload journey (which was half commented-out
 * and Toast-coupled) is reduced to an `onPickImage` seam — the host owns
 * picking, upload, and feedback.
 */
export const Component: React.FC<ComponentProps> = ({
	name,
	avatarUrl,
	contact,
	size = 64,
	editable = false,
	uploading = false,
	onPress,
	onPickImage,
	testID = `avatar-contact`,
}) => {
	let profilePictureUrl = avatarUrl

	try {
		// @ts-ignore legacy shape probe (see prop docs)
		profilePictureUrl = profilePictureUrl ?? contact?.profileImage?.files?.url
	} catch {
		// ignore probe failures
	}

	if (!profilePictureUrl && typeof contact?.profile_image_url === 'string' && contact.profile_image_url) {
		profilePictureUrl = contact.profile_image_url
	}

	const displayName =
		name ??
		(`${contact?.firstName ?? ''} ${contact?.lastName ?? ''}`.trim() ||
			`${contact?.user_name ?? contact?.name ?? ''}`)

	return (
		<TouchableOpacity
			testID={testID}
			accessibilityLabel={displayName ? `${displayName} avatar` : `Contact avatar`}
			style={{
				width: size,
				height: size,
				minHeight: size,
				borderRadius: size * 0.55,
				overflow: `hidden`,
				justifyContent: `center`,
				alignItems: `center`,
			}}
			onPress={() => {
				if (editable) {
					void onPickImage?.()
				} else {
					onPress?.()
				}
			}}>
			{uploading ? (
				<Loader size={28} />
			) : profilePictureUrl ? (
				<Avatar.Image size={size} source={{ uri: profilePictureUrl }} />
			) : displayName ? (
				<Avatar.Text size={size} label={initials(displayName) || ``} />
			) : (
				<Avatar.Icon size={size} icon={`face-man`} />
			)}
		</TouchableOpacity>
	)
}
