import type { Meta, StoryObj } from '@storybook/react-native'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useState } from 'react'
import { ActionSheet, BottomSheet, Button, Dialog, Modal, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Overlays/Dialog',
} satisfies Meta

export default meta

export const Dialogs: StoryObj = {
	render: () => {
		const [open, setOpen] = useState(false)
		const [modal, setModal] = useState(false)
		const [sheet, setSheet] = useState(false)
		return (
			<View gap={12}>
				<Button variant="primary" onPress={() => setOpen(true)}>
					Open dialog
				</Button>
				<Button variant="secondary" onPress={() => setModal(true)}>
					Open modal
				</Button>
				<Button variant="secondary" onPress={() => setSheet(true)}>
					Open action sheet
				</Button>
				<Dialog
					isOpen={open}
					setOpen={setOpen}
					title="Done"
					message="Saved"
					variant="success"
					cta={<Button onPress={() => setOpen(false)}>OK</Button>}
				/>
				<Modal isVisible={modal} onBackdropPress={() => setModal(false)}>
					<Text>Modal content</Text>
				</Modal>
				<ActionSheet
					isOpen={sheet}
					setOpen={setSheet}
					title="Share"
					actions={[
						{ title: 'Copy link', onPress: () => setSheet(false) },
						{ title: 'Delete', onPress: () => setSheet(false), isLast: true },
					]}
				/>
			</View>
		)
	},
}

export const InlineSheet: StoryObj = {
	render: () => (
		<View style={{ height: 320 }}>
			<BottomSheet snapPoints={['25%', '50%']}>
				<BottomSheetView style={{ padding: 16 }}>
					<Text variant="titleMedium">Inline bottom sheet</Text>
					<Text color="muted">Drag the handle</Text>
				</BottomSheetView>
			</BottomSheet>
		</View>
	),
}
