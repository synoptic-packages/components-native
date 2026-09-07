import type { Meta, StoryObj } from '@storybook/react-native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Alert,
	Badge,
	Button,
	Card,
	ChartLine,
	Chip,
	Divider,
	FieldCheckbox,
	FieldCountry,
	FieldCountryState,
	FieldCreditCard,
	FieldCrypto,
	FieldCurrency,
	FieldImage,
	FieldNumber,
	FieldPassword,
	FieldPhone,
	FieldSwitch,
	FieldText,
	Icon,
	ListCard,
	ListItem,
	Loader,
	Money,
	Pressable,
	Progress,
	QrCode,
	QuickAction,
	ScrollView,
	SegmentedControl,
	SkeletonForm,
	Text,
	TouchableOpacity,
	View,
} from '@synotech/components-native'

const meta = {
	title: 'QA/Gallery',
} satisfies Meta

export default meta

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<View gap={8}>
			<Text variant="titleMedium">{title}</Text>
			{children}
			<Divider />
		</View>
	)
}

function Gallery() {
	const { control } = useForm({
		defaultValues: {
			name: '',
			qty: 0,
			notify: false,
			agree: false,
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
	const [segment, setSegment] = useState('d')

	return (
		<ScrollView>
			<View gap={16}>
			<Section title="Gallery controls">
				<Button onPress={() => console.log('gallery')}>Gallery primary</Button>
				<Pressable backgroundColor="primary" borderRadius={12} padding={12} onPress={() => console.log('pressable')}>
					<Text>Gallery pressable</Text>
				</Pressable>
				<TouchableOpacity backgroundColor="bgLighter" padding={12} onPress={() => console.log('touchable')}>
					<Text>Gallery touchable</Text>
				</TouchableOpacity>
				<QuickAction icon="SySend" label="Gallery send" onPress={() => console.log('send')} />
			</Section>

			<Section title="Gallery text">
				<Text variant="displaySmall">Gallery heading</Text>
			</Section>

			<Section title="Gallery fields basic">
				<FieldText name="name" control={control} label="Gallery name" />
				<FieldNumber name="qty" control={control} label="Gallery qty" />
				<FieldSwitch name="notify" control={control} label="Gallery notify" />
				<FieldCheckbox name="agree" control={control} label="Gallery agree" />
			</Section>

			<Section title="Gallery fields advanced">
				<FieldPhone name="phone" control={control} label="Gallery phone" defaultCountryCode="US" />
				<FieldCountry name="country" control={control} label="Gallery country" />
				<FieldCountryState name="region" control={control} label="Gallery region" country="US" />
				<FieldCurrency name="price" control={control} label="Gallery price" defaultCurrencyCode="USD" />
				<FieldPassword name="secret" control={control} label="Gallery password" strengthIndicatorVariant="both" />
				<FieldCrypto
					name="asset"
					control={control}
					label="Gallery asset"
					assets={[{ symbol: 'BTC', name: 'Bitcoin', slug: 'bitcoin' }]}
				/>
				<FieldCreditCard name="card" control={control} label="Gallery card" />
				<FieldImage name="photo" control={control} label="Gallery photo" />
			</Section>

			<Section title="Gallery feedback">
				<Alert severity="success" message="Gallery alert" />
				<Badge color="error" size={20}>
					9
				</Badge>
				<Chip label="Gallery chip" color="success" />
				<Progress progress={0.6} label="Gallery uploading" />
				<Loader size={24} color="primary" />
				<SkeletonForm isLoading />
			</Section>

			<Section title="Gallery layout">
				<Card header={<Text variant="titleMedium">Gallery card</Text>}>
					<Text>Gallery body</Text>
				</Card>
				<ListCard title="Gallery wallet">
					<ListItem title="Gallery balance" onPress={() => console.log('balance')} />
				</ListCard>
				<SegmentedControl
					options={[
						{ label: 'Day', value: 'd' },
						{ label: 'Week', value: 'w' },
					]}
					selected={segment}
					onSelect={setSegment}
				/>
			</Section>

			<Section title="Gallery data">
				<Text variant="titleMedium">Gallery money v2</Text>
				<Money minor={12500} currencyCode="USD" />
				<ChartLine values={[1, 2, 3, 5, 4, 7, 6]} color="primary" emptyLabel="No history" />
				<Text variant="titleMedium">Gallery qr</Text>
				<QrCode value="https://example.com/t/1" size={180} />
			</Section>

			<Section title="Gallery media">
				<Icon name="Car" size={28} color="primary" />
			</Section>
			</View>
		</ScrollView>
	)
}

export const Default: StoryObj = {
	render: () => <Gallery />,
}
