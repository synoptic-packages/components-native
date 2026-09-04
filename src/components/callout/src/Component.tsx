import React from 'react'
import { lg, md } from '../../../constants'
import { Icon } from '../../icon'
import { Text } from '../../text'
import { View } from '../../view'

/**
 * `testID` is part of the contract, not an extra. A `Callout` is how this app tells a user why something did
 * not happen — a refused quote, a closed capability, a validation refusal — so it is exactly the element an
 * acceptance test needs to assert on, and it could not be selected at all. The wrapper carries the id so the
 * message text stays the readable content underneath it.
 */
export const Component: React.FC<{ message: string; showIcon?: boolean; testID?: string }> = ({
	message,
	showIcon = true,
	testID,
}) => {
	return (
		<View
			testID={testID}
			flexDirection={`row`}
			marginVertical={md}
			padding={lg}
			borderRadius={12}
			backgroundColor={`bgLighter`}>
			{showIcon && <Icon family={`MaterialCommunityIcons`} name={`information`} size={32} />}
			<View style={{ flexGrow: 1, paddingHorizontal: 12 }}>
				<Text align={`left`} variant={`bodySmall`}>
					{message}
				</Text>
			</View>
		</View>
	)
}
