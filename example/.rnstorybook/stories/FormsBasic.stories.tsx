import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
	FieldCheckbox,
	FieldNumber,
	FieldSearchBar,
	FieldSwitch,
	FieldText,
	FieldTextarea,
	Text,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Forms/Basic fields',
} satisfies Meta

export default meta

function BasicFields() {
	const { control } = useForm({
		defaultValues: { email: '', qty: '', bio: '', q: '', agree: false, notify: true },
	})
	return (
		<View gap={12}>
			<FieldText name="email" label="Email" type="email" control={control} placeholder="you@example.com" />
			<FieldText name="password" label="Password" type="password" control={control} />
			<FieldNumber name="qty" label="Qty" control={control} allowDecimals={false} />
			<FieldTextarea name="bio" label="Bio" control={control} numberOfLines={3} />
			<FieldSearchBar name="q" control={control} placeholder="Search..." />
			<FieldCheckbox name="agree" label="I agree" control={control} />
			<FieldSwitch name="notify" label="Notifications" control={control} />
		</View>
	)
}

export const Default: StoryObj = {
	render: () => <BasicFields />,
}

export const Summary: StoryObj = {
	render: () => (
		<View gap={8}>
			<Text variant="titleMedium">react-hook-form wiring</Text>
			<Text color="muted">All fields share one control; validation via rules prop.</Text>
		</View>
	),
}
