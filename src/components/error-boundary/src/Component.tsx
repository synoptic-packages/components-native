import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

export type ErrorBoundaryProps = {
	name?: string
	onError?: (error: Error, errorInfo: ErrorInfo) => void
	errorMessage?: ReactNode
	fallback?: ReactNode
	fallbackRender?: (reset: () => void) => ReactNode
	onReset?: () => void
	children?: ReactNode
}

export type ErrorBoundaryStateProps = {
	error: Error | null
}

const styles = {
	container: {
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'rgba(239, 68, 68, 0.35)',
		backgroundColor: 'rgba(153, 27, 27, 0.12)',
	},
	text: {
		color: '#9ca3af',
		fontSize: 14,
		marginTop: 8,
	},
	retry: {
		marginTop: 12,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: '#C2410C',
	},
	retryText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600' as const,
	},
}

/**
 * Shared error boundary.
 *
 * Adapted from the mobile app's `error-boundary/src/Component.tsx`: the original reported to
 * `@sentry/react-native` (an app-configured service that is not a dependency of this package), which
 * is dropped here — `onError` remains the hook a host uses for its own telemetry. Rendering and reset
 * behaviour are unchanged.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryStateProps> {
	state: ErrorBoundaryStateProps = {
		error: null,
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryStateProps {
		return { error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const { name, onError } = this.props

		if (typeof onError === 'function') {
			onError(error, errorInfo)
		}
	}

	handleReset = () => {
		this.props.onReset?.()
		this.setState({ error: null })
	}

	render() {
		const { error } = this.state

		if (!error) return this.props.children

		if (this.props.fallbackRender) {
			return this.props.fallbackRender(this.handleReset)
		}

		if (this.props.fallback) return this.props.fallback

		if (this.props.errorMessage) return this.props.errorMessage

		if (__DEV__) {
			return (
				<View style={styles.container}>
					<Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '700' }}>
						{this.props.name ?? 'Component'} Error
					</Text>
					<Text style={styles.text}>{error.message}</Text>
					<Pressable style={styles.retry} onPress={this.handleReset}>
						<Text style={styles.retryText}>Retry</Text>
					</Pressable>
				</View>
			)
		}

		return null
	}
}
