import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { ChartLine, ChartSparkline, Money, QrCode, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Data/Money and charts',
} satisfies Meta

export default meta

export const Default: StoryObj = {
	render: () => (
		<View gap={12}>
			<Text variant="titleMedium">Money</Text>
			<Money minor={12500} currencyCode="USD" />
			<Money value={125.5} currencyCode="EUR" unlabelled />
			<Text variant="titleMedium">Line chart</Text>
			<ChartLine values={[1, 2, 3, 5, 4, 7, 6]} color="primary" emptyLabel="No history" />
			<ChartLine values={[]} color="primary" emptyLabel="No history" />
			<Text variant="titleMedium">Sparkline</Text>
			<ChartSparkline values={[10, 12, 9, 14, 11]} color="success" />
			<Text variant="titleMedium">QR code</Text>
			<QrCode value="https://example.com/t/1" size={180} />
		</View>
	),
}
