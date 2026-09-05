import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
	FieldAmountPad,
	FieldArray,
	FieldColor,
	FieldDate,
	FieldDateTime,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Forms/Advanced fields',
} satisfies Meta

export default meta

function AdvancedFields() {
	const { control } = useForm({
		defaultValues: { fare: 0, tags: [], theme: '', dob: '', pickup: null },
	})
	return (
		<View gap={12}>
			<FieldAmountPad name="fare" control={control} currencyCode="USD" label="Fare" presets={[500, 1000]} />
			<FieldArray name="tags" label="Tags" control={control} placeholder="Add tag" />
			<FieldColor name="theme" label="Color" control={control} />
			<FieldDate name="dob" label="Birth date" control={control} />
			<FieldDateTime name="pickup" label="Pickup" control={control} nowLabel="Now" />
		</View>
	)
}

export const Default: StoryObj = {
	render: () => <AdvancedFields />,
}
