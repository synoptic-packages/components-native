import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	AvatarContact,
	AvatarUser,
	Browser,
	Divider,
	ExternalLink,
	FieldText,
	Form,
	Link,
	QrScanner,
	ScrollView,
	Splash,
	StatusError,
	StatusSuccess,
	Text,
	View,
} from '@synotech/components-native'
import { CameraPreview } from '@synotech/components-native/camera-mode'

const meta = {
	title: 'QA/Gallery2',
} satisfies Meta

export default meta

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<View gap={8}>
			<Text variant="titleMedium">{title}</Text>
			{children}
			<Divider />
		</View>
	)
}

// Second sweep story: navigation, identity, splash, status, camera. Split out
// of QA/Gallery because one story grew too long for reliable slow-scroll
// hops — each story stays short enough that every marker is a few hops away.
function Gallery2() {
	const [previewUploading, setPreviewUploading] = useState(false)
	// A REAL package Form (own RHF control, no FormContext provider above).
	// This exact shape — standalone Form outside any registry — is what every
	// ventry screen renders, and the sweep missed it until a throwing
	// useForms() blanked app screens behind mounted modal backdrops.
	const galleryForm = useForm({ defaultValues: { nickname: `` } })

	return (
		<ScrollView>
			<View gap={16}>
				<Section title="Gallery form">
					<Form
						control={galleryForm.control}
						onSubmit={galleryForm.handleSubmit(() => console.log('gallery submit'))}
						onReset={() => galleryForm.reset()}
						submitLabel={`Gallery form save`}>
						{({ control }) => <FieldText control={control} name={`nickname`} label={`Gallery nickname`} />}
					</Form>
				</Section>

				<Section title="Gallery navigation">
					<Link href="/gallery-link" label="Gallery link" onPress={() => console.log('gallery link')} />
					<ExternalLink href="https://example.com" openInBrowser={false}>
						<Text>Gallery external link</Text>
					</ExternalLink>
					<Text variant="bodySmall">Gallery browser</Text>
					<Browser />
				</Section>

				<Section title="Gallery identity">
					<Text variant="bodySmall">Gallery avatar user</Text>
					<AvatarUser />
					<Text variant="bodySmall">Gallery avatar contact</Text>
					<AvatarContact name="Gallery Contact" />
				</Section>

				<Section title="Gallery splash">
					<View height={380}>
						<Splash message="Gallery splash" retryAfterSeconds={3600} />
					</View>
				</Section>

				<Section title="Gallery status">
					<StatusError title="Gallery status error" />
					<StatusSuccess title="Gallery status success" />
				</Section>

				<Section title="Gallery camera">
					<Text variant="bodySmall">Gallery qr scanner</Text>
					<View height={420}>
						<QrScanner onScan={() => console.log('gallery scan')} />
					</View>
					<Text variant="bodySmall">Gallery camera preview</Text>
					<View height={420}>
						<CameraPreview
							preview={null}
							accept={() => console.log('gallery accept')}
							clearPreview={() => console.log('gallery clear')}
							isUploading={previewUploading}
							setIsUploading={setPreviewUploading}
						/>
					</View>
					{/* NOTE: CameraGeneral/CameraSelfie are intentionally NOT in the sweep
					 * (and NOT in the root barrel — opt in via
					 * `@synotech/components-native/camera-mode`). Mounting a live expo
					 * CameraView in the sim poisons ScrollView measurement (bisected:
					 * siblings stop laying out, swipes stop moving). They are thin prop
					 * pass-throughs to expo-camera — covered by typecheck, export audit,
					 * and production use in ventry. QrScanner + CameraPreview (imported
					 * from the camera-mode subpath above to prove it resolves) sweep below. */}
				</Section>
			</View>
		</ScrollView>
	)
}

export const Default: StoryObj = {
	render: () => <Gallery2 />,
}
