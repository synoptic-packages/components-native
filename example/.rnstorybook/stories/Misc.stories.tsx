import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import {
	Button,
	ModalAmountPad,
	ModalCloseButton,
	ModalFormField,
	SegmentedControl,
	Text,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Controls/Misc',
} satisfies Meta

export default meta

export const Segmented: StoryObj = {
	render: () => {
		const [selected, setSelected] = useState(0)
		return (
			<View gap={12}>
				<SegmentedControl
					options={[
						{ label: 'Day', value: 'd' },
						{ label: 'Week', value: 'w' },
						{ label: 'Month', value: 'm' },
					]}
					selected={selected}
					setSelected={setSelected}
				/>
				<Text color="muted">Selected index: {selected}</Text>
			</View>
		)
	},
}

export const ModalHelpers: StoryObj = {
	render: () => {
		const [picker, setPicker] = useState(false)
		const [pad, setPad] = useState(false)
		const [amount, setAmount] = useState(12500)
		const [picked, setPicked] = useState('—')
		return (
			<View gap={12}>
				<Text variant="titleMedium">Picked: {picked}</Text>
				<Text variant="titleMedium">
					Amount: {(amount / 100).toFixed(2)}
				</Text>
				<ModalCloseButton onPress={() => console.log('close')} />
				<Button variant="primary" onPress={() => setPicker(true)}>
					Open option picker
				</Button>
				<Button variant="secondary" onPress={() => setPad(true)}>
					Open amount pad
				</Button>
				<ModalFormField
					isVisible={picker}
					setIsVisible={setPicker}
					options={[
						{ label: 'Kigali', value: 'KGL' },
						{ label: 'Nairobi', value: 'NBO' },
					]}
					onSelect={(opt: { label: string; value: string }) => {
						setPicked(opt.label)
						setPicker(false)
					}}
				/>
				<ModalAmountPad
					isVisible={pad}
					setIsVisible={setPad}
					value={amount}
					onChange={setAmount}
					currencyCode="USD"
					name="fare"
					label="Fare"
				/>
			</View>
		)
	},
}
