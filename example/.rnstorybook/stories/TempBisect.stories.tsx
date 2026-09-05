import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FieldAmountPad, FieldArray, FieldColor, FieldDate, View } from '@synotech/components-native'

// TEMP bisect file — delete after identifying the undefined field.
const meta = {
	title: 'Temp/Bisect',
} satisfies Meta

export default meta

export const OnlyAmountPad: StoryObj = {
	render: () => {
		const { control } = useForm({ defaultValues: { fare: 0 } })
		return (
			<View>
				<FieldAmountPad name="fare" control={control} currencyCode="USD" label="Fare" />
			</View>
		)
	},
}

export const OnlyArray: StoryObj = {
	render: () => {
		const { control } = useForm({ defaultValues: { tags: [] } })
		return (
			<View>
				<FieldArray name="tags" label="Tags" control={control} />
			</View>
		)
	},
}

export const OnlyColor: StoryObj = {
	render: () => {
		const { control } = useForm({ defaultValues: { theme: '' } })
		return (
			<View>
				<FieldColor name="theme" label="Color" control={control} />
			</View>
		)
	},
}

export const OnlyDate: StoryObj = {
	render: () => {
		const { control } = useForm({ defaultValues: { dob: '' } })
		return (
			<View>
				<FieldDate name="dob" label="Birth date" control={control} />
			</View>
		)
	},
}
