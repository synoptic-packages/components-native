import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'
import type { ReactNode } from 'react'

import { Pressable } from '../../pressable/index'

export interface ComponentProps {
	/** URL opened in the system in-app browser. */
	href: string
	children?: ReactNode
	testID?: string
	accessibilityLabel?: string
	/** Fires after the browser opens (or instead, when `openInBrowser` is false). */
	onPress?: () => void | Promise<void>
	/** Set false to handle navigation yourself (tests, custom tabs). */
	openInBrowser?: boolean
}

/**
 * External link: opens `href` in the in-app browser, otherwise a plain
 * pressable. Ported from ventry `external-link`, which wrapped expo-router's
 * `Link`; the library version uses `Pressable` directly so it works without
 * a router provider (same router-agnostic rule as `Link`).
 */
export const Component: React.FC<ComponentProps> = ({
	href,
	children,
	testID,
	accessibilityLabel,
	onPress,
	openInBrowser = true,
}) => {
	return (
		<Pressable
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole={`link`}
			onPress={async () => {
				if (openInBrowser) {
					await openBrowserAsync(href, {
						presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
					})
				}
				await onPress?.()
			}}>
			{children}
		</Pressable>
	)
}
