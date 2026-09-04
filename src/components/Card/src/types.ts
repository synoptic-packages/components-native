import type { ColorName } from '../../../constants/index'
import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface ComponentProps {
	header?: ReactNode
	footer?: ReactNode
	children: ReactNode
	height?: number
	backgroundColor?: ColorName
	style?: StyleProp<ViewStyle>
	testID?: string
}
