import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'

import { useTheme } from '../../../hooks/useTheme'

import { TGeneric, ValidationRules } from '../../../types'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import { useController, type Control } from 'react-hook-form'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'

export interface UploadFile {
	uri?: string | null
	base64?: string | null
	fileName?: string | null
	mimeType?: string | null
	type?: string | null
	fileSize?: number | null
	[key: string]: unknown
}

interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	/**
	 * Where the image comes from. `library` (default) keeps every existing caller unchanged; `camera`
	 * is for evidence that must be taken now rather than chosen from the roll — courier proof-of-delivery
	 * is the first such caller.
	 */
	source?: 'library' | 'camera'
	/**
	 * Ask the picker for the bytes as well as the uri. Off by default because it doubles the memory a
	 * picked image costs; on for callers that upload through a Cloud Function, which takes base64.
	 */
	base64?: boolean
	testID?: string
	/**
	 * Error sink for permission/picker failures. The app wires this to its
	 * snackbar; without it failures stay silent (no app store in package).
	 */
	onError?: (_message: string) => void
}

const resolvePreviewUri = (value: unknown) => {
	if (typeof value === 'string' && value.trim()) {
		return value
	}

	if (value && typeof value === 'object') {
		const record = value as Record<string, unknown>
		for (const key of ['uri', 'url', 'file']) {
			if (typeof record[key] === 'string' && record[key]) {
				return record[key] as string
			}
		}
	}

	return undefined
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	control,
	rules,
	source = 'library',
	base64 = false,
	testID,
	onError,
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const notifyError = (message: string) => onError?.(message)
	const {
		field: { onChange, value },
	} = useController({ name, control, rules })

	const isCamera = source === 'camera'
	const previewUri = resolvePreviewUri(value)

	const pickImage = async () => {
		try {
			const { status } = isCamera
				? await ImagePicker.requestCameraPermissionsAsync()
				: await ImagePicker.requestMediaLibraryPermissionsAsync()

			if (status !== 'granted') {
				notifyError(
					isCamera
						? `Camera permission is required to take this photo.`
						: `Photo library permission is required to choose an image.`
				)
				return
			}

			const options: ImagePicker.ImagePickerOptions = {
				mediaTypes: 'images',
				allowsEditing: true,
				quality: 0.85,
				base64,
			}
			const result = isCamera
				? await ImagePicker.launchCameraAsync(options)
				: await ImagePicker.launchImageLibraryAsync(options)

			if (!result.canceled && result.assets?.[0]) {
				onChange(result.assets[0] as UploadFile)
			}
		} catch (error: any) {
			notifyError(error?.message || (isCamera ? `Unable to take a photo.` : `Unable to choose an image.`))
		}
	}

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true} testID={testID}>
			<View style={componentStyles.container}>
				<View style={componentStyles.preview}>
					{previewUri ? (
						<Image contentFit={`cover`} source={{ uri: previewUri }} style={componentStyles.image} />
					) : (
						<View style={componentStyles.placeholder}>
							<Icon
								family={`Lucide`}
								name={isCamera ? `Camera` : `ImagePlus`}
								size={28}
								color={`muted`}
							/>
							<Text color={`muted`} align={`center`}>
								{isCamera
									? `Take a photo to attach to this field.`
									: `Choose an image to attach to this field.`}
							</Text>
						</View>
					)}
				</View>

				<View style={componentStyles.actions}>
					<Pressable
						testID={`field-${name}-capture`}
						accessibilityRole={`button`}
						accessibilityLabel={isCamera ? `Take a photo` : `Choose an image`}
						style={[componentStyles.actionButton, componentStyles.actionButtonPrimary]}
						onPress={pickImage}>
						<Icon family={`Lucide`} name={isCamera ? `Camera` : `ImagePlus`} size={18} color={`primary`} />
						<Text color={`text`}>
							{isCamera
								? previewUri
									? `Retake photo`
									: `Take photo`
								: previewUri
									? `Replace image`
									: `Choose image`}
						</Text>
					</Pressable>
					{previewUri ? (
						<Pressable
							testID={`field-${name}-remove`}
							accessibilityRole={`button`}
							accessibilityLabel={`Remove`}
							style={[componentStyles.actionButton, componentStyles.actionButtonDanger]}
							onPress={() => onChange(null)}>
							<Icon family={`Lucide`} name={`Trash2`} size={18} color={`error`} />
							<Text color={`error`}>{`Remove`}</Text>
						</Pressable>
					) : null}
				</View>
			</View>
		</FieldHelper>
	)
}
