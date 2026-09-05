import type { Meta, StoryObj } from '@storybook/react-native'
import { Column, Divider, Loader, Row, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Foundations/Text',
	component: Text,
} satisfies Meta<typeof Text>

export default meta

export const Variants: StoryObj<typeof Text> = {
	render: () => (
		<View gap={8}>
			<Text variant="displaySmall">Display small</Text>
			<Text variant="titleLarge">Title large</Text>
			<Text variant="titleMedium">Title medium</Text>
			<Text variant="bodyMedium">Body medium — the quick brown fox.</Text>
			<Text variant="labelLarge">Label large</Text>
			<Text color="muted">Muted text</Text>
			<Text color="primary">Primary text</Text>
			<Text color="error">Error text</Text>
			<Text bold>Bold text</Text>
			<Text italic>Italic text</Text>
			<Text underline>Underlined text</Text>
			<Text align="center">Centered text</Text>
		</View>
	),
}
