import { View } from '../../view'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import type { MapHandle, MapProps } from './types'

const MAP_BASE_URL = 'https://vya.to/account/map'

export const Component = forwardRef<MapHandle, MapProps>(function MapWebview({ style, webviewUrl }, forwardedRef) {
	const handle = useMemo<MapHandle>(
		() => ({
			flyTo: () => {},
			fitBounds: () => {},
			getUserLocation: () => null,
			getCenter: () => null,
		}),
		[]
	)

	useImperativeHandle(forwardedRef, () => handle, [handle])

	const mapUrl = webviewUrl || MAP_BASE_URL

	return (
		<View backgroundColor={`bg`} style={[styles.container, style as any]}>
			<WebView
				style={styles.webview}
				source={{ uri: mapUrl }}
				originWhitelist={[`*`]}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				geolocationEnabled={true}
				allowsInlineMediaPlayback={true}
				startInLoadingState={true}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		minHeight: 320,
		borderRadius: 4,
		overflow: 'hidden',
	},
	webview: {
		flex: 1,
		backgroundColor: 'transparent',
	},
})

Component.displayName = 'MapWebview'
