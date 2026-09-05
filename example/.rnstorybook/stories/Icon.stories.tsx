import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { Icon, ListIcon, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Media/Icon',
	component: Icon,
} satisfies Meta<typeof Icon>

export default meta

export const Families: StoryObj<typeof Icon> = {
	render: () => (
		<View gap={12}>
			<Text variant="titleMedium">Auto family</Text>
			<View flexDirection="row" gap={12}>
				<Icon name="Car" size={28} />
				<Icon name="Car" size={28} color="primary" />
				<Icon name="Car" size={28} color="error" />
			</View>
			<Text variant="titleMedium">Explicit families</Text>
			<View flexDirection="row" gap={12}>
				<Icon family="Ionicons" name="warning" size={28} color="warning" />
				<Icon family="MaterialCommunityIcons" name="car" size={28} color="success" />
			</View>
			<Text variant="titleMedium">ListIcon</Text>
			<View flexDirection="row" gap={12}>
				<ListIcon name="ChevronRight" />
				<ListIcon name="ChevronRight" color="primary" />
			</View>
		</View>
	),
}
