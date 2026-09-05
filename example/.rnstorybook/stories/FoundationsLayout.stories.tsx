import type { Meta, StoryObj } from '@storybook/react-native'
import { Column, Divider, Loader, Row, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Foundations/Layout',
} satisfies Meta

export default meta

export const Layout: StoryObj = {
	render: () => (
		<View gap={12}>
			<Text variant="titleMedium">View + Row + Column</Text>
			<View backgroundColor="bgLighter" borderRadius={12} padding={16}>
				<Text>Padded card view</Text>
			</View>
			<Row gap={8}>
				<Column>
					<View backgroundColor="bgLighter" padding={12}>
						<Text>A</Text>
					</View>
				</Column>
				<Column>
					<View backgroundColor="bgLighter" padding={12}>
						<Text>B</Text>
					</View>
				</Column>
			</Row>
			<Divider title="or" />
			<Divider />
			<Row gap={12}>
				<Loader size={32} color="primary" />
				<Loader size={24} color="success" />
				<Loader size={16} color="muted" />
			</Row>
		</View>
	),
}
