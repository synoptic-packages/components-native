import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { Card, ListCard, ListEmptyComponent, ListItem, SectionCarousel, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Layout/Card',
	component: Card,
} satisfies Meta<typeof Card>

export default meta

export const Cards: StoryObj<typeof Card> = {
	render: () => (
		<View gap={12}>
			<Card header={<Text variant="titleMedium">Header</Text>} footer={<Text color="muted">Footer</Text>}>
				<Text>Body</Text>
			</Card>
			<ListCard title="Wallet">
				<ListItem title="Balance" subTitle="$10.00" onPress={() => console.log('balance')} />
				<ListItem title="History" isLast onPress={() => console.log('history')} />
			</ListCard>
			<ListEmptyComponent title="Nothing here" description="Pull to refresh" />
			<SectionCarousel title="Nearby" onPressAction={() => console.log('see all')}>
				<Card>
					<Text>Ride A</Text>
				</Card>
				<Card>
					<Text>Ride B</Text>
				</Card>
			</SectionCarousel>
		</View>
	),
}
