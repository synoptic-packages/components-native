import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
	FieldAmountPad,
	FieldArray,
	FieldColor,
	FieldCountry,
	FieldCountryState,
	FieldCreditCard,
	FieldCrypto,
	FieldCurrency,
	FieldDate,
	FieldDateTime,
	FieldImage,
	FieldPassword,
	FieldPhone,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'Forms/Advanced fields',
} satisfies Meta

export default meta

function AdvancedFields() {
	const { control } = useForm({
		defaultValues: {
			fare: 0,
			tags: [],
			theme: '',
			dob: '',
			pickup: null,
			phone: null,
			country: 'US',
			region: '',
			price: null,
			secret: '',
			asset: null,
			card: null,
			photo: null,
		},
	})
	return (
		<View gap={12}>
			<FieldAmountPad name="fare" control={control} currencyCode="USD" label="Fare" presets={[500, 1000]} />
			<FieldArray name="tags" label="Tags" control={control} placeholder="Add tag" />
			<FieldColor name="theme" label="Color" control={control} />
			<FieldDate name="dob" label="Birth date" control={control} />
			<FieldDateTime name="pickup" label="Pickup" control={control} nowLabel="Now" />
			<FieldPhone name="phone" control={control} label="Phone" defaultCountryCode="US" />
			<FieldCountry name="country" control={control} label="Country" />
			<FieldCountryState name="region" control={control} label="State" country="US" />
			<FieldCurrency name="price" control={control} label="Price" defaultCurrencyCode="USD" />
			<FieldPassword
				name="secret"
				control={control}
				label="Password"
				strengthIndicatorVariant="both"
			/>
			<FieldCrypto
				name="asset"
				control={control}
				label="Asset"
				assets={[{ symbol: 'BTC', name: 'Bitcoin', slug: 'bitcoin' }]}
			/>
			<FieldCreditCard name="card" control={control} label="Card" />
			<FieldImage name="photo" control={control} label="Photo" />
		</View>
	)
}

export const Default: StoryObj = {
	render: () => <AdvancedFields />,
}
