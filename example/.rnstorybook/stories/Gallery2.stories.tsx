import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import {
	AvatarContact,
	AvatarUser,
	Browser,
	CameraPreview,
	Divider,
	ExternalLink,
	Link,
	QrScanner,
	ScrollView,
	Splash,
	StatusError,
	StatusSuccess,
	Text,
	View,
} from '@synotech/components-native'

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

	return (
		<ScrollView>
			<View gap={16}>
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
					{/* NOTE: CameraGeneral/CameraSelfie are intentionally NOT in the sweep.
					 * Mounting a live expo CameraView in the sim poisons ScrollView measurement
					 * (verified by bisect: siblings below never lay out, swipes stop moving).
					 * They are thin prop pass-throughs to expo-camera — covered by typecheck,
					 * export audit, and production use in ventry. QrScanner + CameraPreview
					 * (the stateful ones) sweep below. */}
				</Section>
			</View>
		</ScrollView>
	)
}

export const Default: StoryObj = {
	render: () => <Gallery2 />,
}
