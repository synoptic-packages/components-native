import type { WebViewProps } from 'react-native-webview'

export interface BrowserOpenProps extends WebViewProps {
	title?: string
	uri?: string
	html?: string
	baseUrl?: string
	emptyMessage?: string
	showHeader?: boolean
	onClose?: () => void
}

export interface BrowserState extends BrowserOpenProps {
	isOpen: boolean
}

export interface BrowserRuntimeState {
	isOpen: boolean
	title?: string
	currentUrl?: string
	canGoBack: boolean
	canGoForward: boolean
	isLoading: boolean
}

export interface BrowserHandle {
	open: (_browser: BrowserOpenProps) => void
	close: () => void
	goBack: () => void
	goForward: () => void
	reload: () => void
	stopLoading: () => void
	injectJavaScript: (_script: string) => void
	postMessage: (_message: string) => void
	getState: () => BrowserRuntimeState
}

export interface ComponentProps {
	onStateChange?: (_state: BrowserRuntimeState) => void
}

export const BrowserEmpty: BrowserState = {
	isOpen: false,
	title: '',
	uri: undefined,
	html: undefined,
	baseUrl: undefined,
	showHeader: true,
	source: undefined,
	emptyMessage: undefined,
	onClose: undefined,
	style: undefined,
	originWhitelist: undefined,
	startInLoadingState: undefined,
	onNavigationStateChange: undefined,
	onLoadStart: undefined,
	onLoadEnd: undefined,
	onError: undefined,
	onMessage: undefined,
}

export const BrowserRuntimeEmpty: BrowserRuntimeState = {
	isOpen: false,
	title: '',
	currentUrl: undefined,
	canGoBack: false,
	canGoForward: false,
	isLoading: false,
}
