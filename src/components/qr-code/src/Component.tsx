import { Qrcode } from '@synotech/qrcode-native'
import React from 'react'

import { useTheme } from '../../../hooks/useTheme'
import { View } from '../../view'

export interface QrCodeProps {
	value: string
	size?: number
	testID?: string
}

/**
 * The single shared QR surface for native product code. Wraps the sanctioned `@synotech/qrcode-native`
 * renderer once; containers pass a backend-owned payload and never import the QR library directly. The
 * code is drawn dark-on-white regardless of theme so it stays scannable in light and dark modes.
 */
export const Component: React.FC<QrCodeProps> = ({ value, size = 220, testID }) => {
	const { colors } = useTheme()
	return (
		<View
			testID={testID}
			padding={16}
			borderRadius={20}
			backgroundColor={`white`}
			alignItems={`center`}
			justifyContent={`center`}>
			<Qrcode
				value={value}
				size={size}
				level={`M`}
				color={String(colors.dark)}
				bgColor={String(colors.white)}
				padding={0}
				margin={0}
			/>
		</View>
	)
}
