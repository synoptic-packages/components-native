import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message'
import {
	Alert,
	Badge,
	Button,
	Callout,
	Chip,
	Progress,
	SkeletonForm,
	Snackbar,
	Text,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Feedback/Alerts',
} satisfies Meta

export default meta

export const Alerts: StoryObj = {
	render: () => (
		<View gap={12}>
			<Alert severity="success" variant="filled" message="Fare adjusted" />
			<Alert severity="warning" message="Surge pricing active" />
			<Alert severity="error" message="Payment failed" />
			<Alert severity="info" message="Driver is nearby" />
			<Callout message="Quote refused by driver" />
		</View>
	),
}

export const BadgesChips: StoryObj = {
	render: () => (
		<View gap={12}>
			<View flexDirection="row" gap={8}>
				<Badge color="error" size={20}>
					3
				</Badge>
				<Badge dot color="success" />
				<Badge color="primary">new</Badge>
			</View>
			<View flexDirection="row" gap={8}>
				<Chip label="APPROVED" color="success" />
				<Chip label="PENDING" color="warning" />
				<Chip label="Saved" selected onPress={() => console.log('chip')} />
			</View>
		</View>
	),
}

export const ProgressStates: StoryObj = {
	render: () => {
		const [open, setOpen] = useState(true)
		return (
			<View gap={12}>
				<Progress progress={0.6} label="Uploading" />
				<Progress progress={0.5} segments={4} />
				<SkeletonForm isLoading />
				<Snackbar open={open} message="Saved" severity="success" onDismiss={() => setOpen(false)} />
				<Button variant="secondary" onPress={() => setOpen(true)}>
					Show snackbar
				</Button>
				<Button
					variant="primary"
					onPress={() => Toast.show({ type: 'success', text1: 'Saved', text2: 'Your changes are live' })}>
					Show toast
				</Button>
				<Text color="muted">Toast renders in the preview root (decorator).</Text>
			</View>
		)
	},
}
