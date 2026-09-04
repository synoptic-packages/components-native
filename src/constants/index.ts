/**
 * Shared sizing/input tokens, platform flags and key registry for the components library.
 *
 * This is a CONFIG-FREE version of the mobile app's `src/constants/index.ts`: the `constants`/
 * `extra` expo-config reads (tenant runtime config) are intentionally absent — the host app injects
 * runtime values it needs through `lib/brand.ts` and explicit props.
 */
import { Dimensions, Platform } from 'react-native'

export type { ColorName } from '../theme/colors'

export const isAndroid = Platform.OS === 'android'
export const isIos = Platform.OS === 'ios'

export const deviceWidth = Dimensions.get('window').width
export const deviceHeight = Dimensions.get('window').height

export const zIndex = {
	modalOverlayMin: 99999,
	modalOverlayMid: 999999,
	modalOverlayHigh: 9999999,
	modalOverlayMax: 99999999,
}

export const input = {
	borderWidth: 1,
	borderRadius: 9,
	height: 42,
	hintFontSize: 11,
	fontSize: 13,
	labelFontSize: 11,
	padding: 10,
}

export const sm = 6 as const
export const md = 12 as const
export const lg = 18 as const
export const xl = 30 as const
