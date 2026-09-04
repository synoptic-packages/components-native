import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import React from 'react'

/**
 * A section's title and its round "see all" control.
 *
 * Extracted out of `SectionCarousel` rather than copied beside it, because a screen commonly has both
 * a scroller and a list under the same kind of heading — Krugergold's home has exactly that pair — and
 * two headers that are meant to look identical will not stay identical if they are two pieces of
 * markup. `SectionCarousel` now renders this, so there is one heading in the app and one place to
 * change it.
 *
 * The title takes the `wide` face at 20 and never `bold`, which would override the family.
 */
export interface ComponentProps {
	title: string
	onPressAction?: () => void
	actionTestID?: string
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({ title, onPressAction, actionTestID, testID }) => (
	<View
		testID={testID}
		flexDirection={`row`}
		alignItems={`center`}
		justifyContent={`space-between`}
		marginBottom={12}>
		<Text fontFamily={`wide`} fontSize={20} color={`text`}>
			{title}
		</Text>
		{onPressAction ? (
			<Pressable
				testID={actionTestID}
				accessibilityRole={`button`}
				accessibilityLabel={`View all ${title}`}
				backgroundColor={`bgLighter`}
				borderRadius={20}
				padding={12}
				onPress={onPressAction}>
				<Icon family={`Fontisto`} name={`arrow-right`} size={16} color={`text`} />
			</Pressable>
		) : null}
	</View>
)
