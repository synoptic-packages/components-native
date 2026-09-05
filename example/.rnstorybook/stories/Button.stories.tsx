import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { Button, Money, Text, View } from '@synotech/components-native'
import { ButtonFancy } from '@synotech/components-native'
import { Pressable, QuickAction, TouchableOpacity } from '@synotech/components-native'

const meta = {
	title: 'Controls/Button',
	component: Button,
} satisfies Meta<typeof Button>

export default meta

export const Variants: StoryObj<typeof Button> = {
	render: () => (
		<View gap={12}>
			<Button variant="primary" onPress={() => console.log('primary')}>
				Primary button
			</Button>
			<Button variant="secondary">Secondary button</Button>
			<Button variant="accent">Accent button</Button>
			<Button variant="error" mode="outlined">
				Outlined danger
			</Button>
			<Button variant="primary" loading>
				Loading button
			</Button>
			<Button variant="primary" disabled>
				Disabled button
			</Button>
			<Button variant="primary" size="small">
				Small button
			</Button>
		</View>
	),
}

export const Fancy: StoryObj = {
	render: () => (
		<View gap={12}>
			<ButtonFancy
				icon="car"
				title="Trip in progress"
				subtitle="Arriving in 5 min"
				trailing={<Money minor={12500} currencyCode="USD" />}
				onPress={() => console.log('fancy')}
			/>
			<QuickAction icon="SySend" label="Send" onPress={() => console.log('send')} />
			<QuickAction icon="SySend" label="Send" badge="2" onPress={() => console.log('send')} />
			<Pressable backgroundColor="primary" borderRadius={12} padding={12} onPress={() => console.log('pressable')}>
				<Text color="white">Pressable</Text>
			</Pressable>
			<TouchableOpacity backgroundColor="bgLighter" padding={12} onPress={() => console.log('touchable')}>
				<Text>TouchableOpacity</Text>
			</TouchableOpacity>
		</View>
	),
}
