import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PaperProvider } from 'react-native-paper'
import { Button, Text, View, Card, setBrandColors } from '@synotech/components-native'
import StorybookUIRoot from './.rnstorybook'

// Brand override (optional — defaults are used when unregistered).
setBrandColors({ primary: '#C2410C', accent: '#FDBA74' })

// EXPO_PUBLIC_STORYBOOK_ENABLED=true swaps the entry to the on-device
// Storybook. Storybook v10's metro plugin strips storybook modules from the
// bundle when disabled, so this import is production-safe.
const SHOW_STORYBOOK = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true'

function App() {
	return (
		<SafeAreaProvider>
			<PaperProvider>
				<View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 24, gap: 12 }}>
					<StatusBar style="auto" />
					<Text variant="displaySmall" color="text">
						@synotech/components-native
					</Text>
					<Card style={{ padding: 16, gap: 12 }}>
						<Text variant="titleMedium" color="primary">
							Shared design system, installed from npm
						</Text>
						<Text color="text" style={{ opacity: 0.7 }}>
							This example app imports Button, Text, Card, View + the theme hooks from the
							package and renders them with react-native-paper.
						</Text>
						<Button variant="primary" onPress={() => console.log('pressed')}>
							Primary button
						</Button>
						<Button variant="secondary">Secondary button</Button>
						<Button variant="error" mode="outlined">
							Outlined danger
						</Button>
					</Card>
				</View>
			</PaperProvider>
		</SafeAreaProvider>
	)
}

export default SHOW_STORYBOOK ? StorybookUIRoot : App
