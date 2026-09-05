import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormContext } from '@synotech/components-native'
import { Button, FieldText, Form, FormModal, Text, View } from '@synotech/components-native'

const meta = {
	title: 'Forms/Form container',
} satisfies Meta

export default meta

function InlineForm() {
	const { control, handleSubmit } = useForm({ defaultValues: { name: '' } })
	const [saved, setSaved] = useState('')
	return (
		<FormContext.Provider value={{ form: {}, openForm: () => {}, closeForm: () => {} }}>
			<View gap={12}>
				<Form control={control} onSubmit={handleSubmit((v) => setSaved(v.name))} submitLabel="Save">
					{({ control: c }) => <FieldText name="name" label="Name" control={c} />}
				</Form>
				{saved ? <Text color="success">Saved: {saved}</Text> : null}
			</View>
		</FormContext.Provider>
	)
}

function ModalForm() {
	const [open, setOpen] = useState(false)
	const { control, handleSubmit } = useForm({ defaultValues: { email: '' } })
	return (
		<View gap={12}>
			<Button variant="primary" onPress={() => setOpen(true)}>
				Open form modal
			</Button>
			<FormModal open={open} title="Edit" name="user-edit" onClose={() => setOpen(false)}>
				<FormContext.Provider value={{ form: {}, openForm: () => {}, closeForm: () => {} }}>
					<Form
						control={control}
						asModal
						onSubmit={handleSubmit(() => setOpen(false))}
						submitLabel="Save">
						{({ control: c }) => <FieldText name="email" label="Email" type="email" control={c} />}
					</Form>
				</FormContext.Provider>
			</FormModal>
		</View>
	)
}

export const Inline: StoryObj = {
	render: () => <InlineForm />,
}

export const InModal: StoryObj = {
	render: () => <ModalForm />,
}
