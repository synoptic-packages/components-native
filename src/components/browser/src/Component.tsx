import * as React from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView, type WebViewMessageEvent, type WebViewNavigation, type WebViewProps } from 'react-native-webview'

import { useTheme } from '../../../hooks/useTheme'
import { ErrorBoundary } from '../../error-boundary/index'
import { Icon } from '../../icon/index'
import { Modal } from '../../modal/index'
import { Text } from '../../text/index'
import { TouchableOpacity } from '../../touchable-opacity/index'
import { View } from '../../view/index'
import { styles } from './styles'
import {
	BrowserEmpty,
	BrowserRuntimeEmpty,
	type BrowserHandle,
	type BrowserOpenProps,
	type BrowserRuntimeState,
	type BrowserState,
	type ComponentProps,
} from './types'

const getRequestedUrl = (browser: Pick<BrowserOpenProps, 'source' | 'uri'>) => {
	if (typeof browser.uri === 'string' && browser.uri.trim()) {
		return browser.uri.trim()
	}

	const source = browser.source

	if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') {
		return source.uri
	}

	return undefined
}

const resolveSource = (browser: BrowserState): WebViewProps['source'] => {
	if (browser.source) {
		return browser.source
	}

	if (typeof browser.uri === 'string' && browser.uri.trim()) {
		return { uri: browser.uri.trim() }
	}

	if (typeof browser.html === 'string' && browser.html.trim()) {
		return {
			html: browser.html,
			...(browser.baseUrl ? { baseUrl: browser.baseUrl } : null),
		}
	}

	return undefined
}

type ControlButtonProps = {
	accessibilityLabel: string
	disabled?: boolean
	icon: string
	onPress: () => void
}

const ControlButton: React.FC<ControlButtonProps> = ({ accessibilityLabel, disabled = false, icon, onPress }) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	return (
		<TouchableOpacity
			accessibilityLabel={accessibilityLabel}
			accessibilityRole={`button`}
			disabled={disabled}
			onPress={onPress}
			style={[componentStyles.headerButton, disabled ? componentStyles.headerButtonDisabled : null]}>
			<Icon family={`Feather`} name={icon} size={22} color={disabled ? 'muted' : 'text'} />
		</TouchableOpacity>
	)
}

export const Component = React.forwardRef<BrowserHandle, ComponentProps>(function Component({ onStateChange }, ref) {
	const insets = useSafeAreaInsets()
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const webViewRef = React.useRef<WebView>(null)
	const browserRef = React.useRef<BrowserState>(BrowserEmpty)
	const [browser, setBrowser] = React.useState<BrowserState>(BrowserEmpty)
	const [runtimeState, setRuntimeState] = React.useState<BrowserRuntimeState>(BrowserRuntimeEmpty)

	const updateRuntimeState = React.useCallback(
		(nextState: Partial<BrowserRuntimeState>) => {
			setRuntimeState((currentState) => {
				const mergedState = {
					...currentState,
					...nextState,
				}

				onStateChange?.(mergedState)

				return mergedState
			})
		},
		[onStateChange]
	)

	const open = React.useCallback(
		(nextBrowser: BrowserOpenProps) => {
			const nextState: BrowserState = {
				...BrowserEmpty,
				...nextBrowser,
				isOpen: true,
			}
			const requestedUrl = getRequestedUrl(nextBrowser)

			browserRef.current = nextState
			setBrowser(nextState)
			updateRuntimeState({
				...BrowserRuntimeEmpty,
				isOpen: true,
				title: nextState.title,
				currentUrl: requestedUrl,
				isLoading: Boolean(resolveSource(nextState)),
			})
		},
		[updateRuntimeState]
	)

	const close = React.useCallback(() => {
		const currentBrowser = browserRef.current

		if (!currentBrowser.isOpen) {
			return
		}

		browserRef.current = BrowserEmpty
		setBrowser(BrowserEmpty)
		updateRuntimeState(BrowserRuntimeEmpty)
		currentBrowser.onClose?.()
	}, [updateRuntimeState])

	const goBack = React.useCallback(() => {
		webViewRef.current?.goBack()
	}, [])

	const goForward = React.useCallback(() => {
		webViewRef.current?.goForward()
	}, [])

	const reload = React.useCallback(() => {
		webViewRef.current?.reload()
	}, [])

	const stopLoading = React.useCallback(() => {
		webViewRef.current?.stopLoading()
	}, [])

	const injectJavaScript = React.useCallback((script: string) => {
		webViewRef.current?.injectJavaScript(script)
	}, [])

	const postMessage = React.useCallback((message: string) => {
		webViewRef.current?.postMessage(message)
	}, [])

	React.useImperativeHandle(
		ref,
		() => ({
			open,
			close,
			goBack,
			goForward,
			reload,
			stopLoading,
			injectJavaScript,
			postMessage,
			getState: () => runtimeState,
		}),
		[close, goBack, goForward, injectJavaScript, open, postMessage, reload, runtimeState, stopLoading]
	)

	const resolvedSource = React.useMemo(() => resolveSource(browser), [browser])
	const contentInsets = React.useMemo(() => {
		if (browser.showHeader !== false) {
			return null
		}

		return {
			paddingTop: insets.top,
			paddingBottom: insets.bottom,
		}
	}, [browser.showHeader, insets.bottom, insets.top])

	const handleNavigationStateChange = React.useCallback(
		(navigationState: WebViewNavigation) => {
			updateRuntimeState({
				isOpen: true,
				title: browserRef.current.title,
				currentUrl: navigationState.url,
				canGoBack: navigationState.canGoBack,
				canGoForward: navigationState.canGoForward,
				isLoading: navigationState.loading,
			})
			browserRef.current.onNavigationStateChange?.(navigationState)
		},
		[updateRuntimeState]
	)

	const handleLoadStart = React.useCallback<NonNullable<WebViewProps['onLoadStart']>>(
		(event) => {
			updateRuntimeState({
				isOpen: true,
				title: browserRef.current.title,
				currentUrl: event.nativeEvent.url,
				isLoading: true,
			})
			browserRef.current.onLoadStart?.(event)
		},
		[updateRuntimeState]
	)

	const handleLoadEnd = React.useCallback<NonNullable<WebViewProps['onLoadEnd']>>(
		(event) => {
			updateRuntimeState({
				isOpen: true,
				title: browserRef.current.title,
				currentUrl: event.nativeEvent.url,
				isLoading: false,
			})
			browserRef.current.onLoadEnd?.(event)
		},
		[updateRuntimeState]
	)

	const handleError = React.useCallback<NonNullable<WebViewProps['onError']>>(
		(event) => {
			updateRuntimeState({
				isOpen: true,
				title: browserRef.current.title,
				currentUrl: event.nativeEvent.url,
				isLoading: false,
			})
			browserRef.current.onError?.(event)
		},
		[updateRuntimeState]
	)

	const handleMessage = React.useCallback((event: WebViewMessageEvent) => {
		browserRef.current.onMessage?.(event)
	}, [])

	const {
		baseUrl,
		emptyMessage,
		html,
		isOpen,
		onClose,
		showHeader,
		title,
		uri,
		style,
		onNavigationStateChange,
		onLoadStart,
		onLoadEnd,
		onError,
		onMessage,
		source,
		originWhitelist,
		startInLoadingState,
		...webViewProps
	} = browser

	void baseUrl
	void emptyMessage
	void html
	void onClose
	void title
	void uri
	void onNavigationStateChange
	void onLoadStart
	void onLoadEnd
	void onError
	void onMessage
	void source

	return (
		<ErrorBoundary>
			<Modal isVisible={isOpen} onBackdropPress={close} setIsVisible={(visible) => !visible && close()}>
				<View style={componentStyles.container}>
					{showHeader !== false ? (
						<View style={[componentStyles.header, { paddingTop: insets.top + 12 }]}>
							<ControlButton accessibilityLabel={`Close browser`} icon={`x`} onPress={close} />
							<View style={componentStyles.headerActions}>
								<ControlButton
									accessibilityLabel={`Reload page`}
									disabled={!resolvedSource}
									icon={`rotate-cw`}
									onPress={reload}
								/>
								<ControlButton
									accessibilityLabel={`Go back`}
									disabled={!runtimeState.canGoBack}
									icon={`chevron-left`}
									onPress={goBack}
								/>
								<ControlButton
									accessibilityLabel={`Go forward`}
									disabled={!runtimeState.canGoForward}
									icon={`chevron-right`}
									onPress={goForward}
								/>
							</View>
						</View>
					) : null}

					<View style={[componentStyles.content, contentInsets]}>
						{resolvedSource ? (
							<WebView
								{...webViewProps}
								ref={webViewRef}
								originWhitelist={originWhitelist ?? ['*']}
								onNavigationStateChange={handleNavigationStateChange}
								onLoadStart={handleLoadStart}
								onLoadEnd={handleLoadEnd}
								onError={handleError}
								onMessage={handleMessage}
								startInLoadingState={startInLoadingState ?? true}
								source={resolvedSource}
								style={[componentStyles.webView, style as StyleProp<ViewStyle>]}
							/>
						) : (
							<View style={componentStyles.emptyState}>
								<Text align={`center`} variant={`titleMedium`} style={componentStyles.emptyTitle}>
									Unable to load this page
								</Text>
								<Text align={`center`} variant={`bodyMedium`} style={componentStyles.emptyMessage}>
									{browser.emptyMessage || 'Provide a uri, html, or source when opening the browser.'}
								</Text>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</ErrorBoundary>
	)
})

Component.displayName = 'Browser'
