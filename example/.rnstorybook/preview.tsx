import type { Preview } from '@storybook/react-native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Component as ToastRoot } from '@synotech/components-native'

// Every story renders inside the same providers a host app supplies:
// gesture-handler (bottom sheets), Paper (themed components), SafeArea,
// BottomSheetModal context, and the toast root for imperative toasts.
const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
			<GestureHandlerRootView style={{ flex: 1 }}>
				<PaperProvider>
					<SafeAreaProvider>
						<BottomSheetModalProvider>
							<Story />
							<ToastRoot />
						</BottomSheetModalProvider>
					</SafeAreaProvider>
				</PaperProvider>
			</GestureHandlerRootView>
		),
	],
}

export default preview
