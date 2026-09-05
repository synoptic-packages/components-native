import type { Meta, StoryObj } from '@storybook/react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { ErrorBoundary, FloatingTabBar, Icon, PreauthSlides, SafeAreaView, ScrollView, Text } from '@synotech/components-native'

const meta = {
	title: 'App/Navigation chrome',
} satisfies Meta

export default meta

const Tabs = createBottomTabNavigator()

function Home() {
	return (
		<SafeAreaView edges={['top']} flex={1}>
			<ScrollView padding={16}>
				<Text variant="titleLarge">Home</Text>
				<Text color="muted">FloatingTabBar is the navigator tabBar.</Text>
			</ScrollView>
		</SafeAreaView>
	)
}

function Wallet() {
	return (
		<SafeAreaView edges={['top']} flex={1}>
			<ScrollView padding={16}>
				<Text variant="titleLarge">Wallet</Text>
			</ScrollView>
		</SafeAreaView>
	)
}

export const TabBar: StoryObj = {
	render: () => (
		<NavigationContainer>
			<Tabs.Navigator
				screenOptions={{ headerShown: false }}
				tabBar={(props) => (
					<FloatingTabBar
						{...props}
						centerAction={{
							label: 'Scan',
							testID: 'tab-scan',
							onPress: () => console.log('scan'),
							icon: ({ color, size }: { color: string; size: number }) => (
								<Icon name="ScanLine" size={size} color={color} />
							),
						}}
					/>
				)}>
				<Tabs.Screen name="Home" component={Home} />
				<Tabs.Screen name="Wallet" component={Wallet} />
			</Tabs.Navigator>
		</NavigationContainer>
	),
}

export const SlidesAndBoundary: StoryObj = {
	render: () => (
		<ErrorBoundary name="Slides">
			<PreauthSlides
				slides={[
					{
						graphic: { uri: 'https://picsum.photos/400/300' },
						title: 'Welcome',
						subtitle: 'Rides on demand',
					},
					{
						graphic: { uri: 'https://picsum.photos/400/301' },
						title: 'Pay easily',
						subtitle: 'One wallet everywhere',
					},
				]}
			/>
		</ErrorBoundary>
	),
}
