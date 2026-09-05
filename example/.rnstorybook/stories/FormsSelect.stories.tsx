import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
	FieldLanguage,
	FieldOtp,
	FieldRadio,
	FieldRadioCards,
	FieldSelect,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Forms/Select fields',
} satisfies Meta

export default meta

function SelectFields() {
	const { control } = useForm({
		defaultValues: { city: '', role: 'a', plan: 'std', lang: '', code: '' },
	})
	return (
		<View gap={12}>
			<FieldSelect
				name="city"
				label="City"
				control={control}
				options={[
					{ value: 'KGL', label: 'Kigali' },
					{ value: 'NBO', label: 'Nairobi' },
				]}
			/>
			<FieldRadio
				name="role"
				label="Role"
				control={control}
				row
				options={[
					{ value: 'a', label: 'Rider' },
					{ value: 'b', label: 'Driver' },
				]}
			/>
			<FieldRadioCards
				name="plan"
				control={control}
				options={[{ value: 'std', iconName: 'car', title: 'Standard', description: 'Everyday rides' }]}
			/>
			<FieldLanguage name="lang" label="Language" control={control} />
			<FieldOtp name="code" label="Enter code" control={control} numberOfDigits={5} />
		</View>
	)
}

export const Default: StoryObj = {
	render: () => <SelectFields />,
}
