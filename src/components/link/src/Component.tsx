import type { ReactNode } from 'react'

import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'

export interface ComponentProps {
	children?: ReactNode
	/**
	 * Navigation target. Kept as data (not a router call): the host wires
	 * `onPress` to its own router (`router.push(href)`), so the library stays
	 * navigation-agnostic and testable without an expo-router provider.
	 * Ported from ventry `link`, which bound directly to `ExpoLink`.
	 */
	href: string
	label?: ReactNode
	/**
	 * Set on the PRESSABLE, not on the text inside it. The pressable collapses
	 * its descendants into one accessibility node, so an id on the inner
	 * `Text` disappears from the native tree — same collapse `Icon`
	 * documents. Carried over from the ventry source comment.
	 */
	testID?: string
	accessibilityLabel?: string
	onPress?: () => void | Promise<void>
}

export const Component: React.FC<ComponentProps> = ({
	children,
	href,
	label,
	testID,
	accessibilityLabel,
	onPress,
}) => {
	return (
		<Pressable
			testID={testID}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole={`link`}
			onPress={onPress}>
			<Text color={`primary`} underline={true}>
				{children ?? label}
			</Text>
		</Pressable>
	)
}
