/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

export type ThemeColorMode = 'light' | 'dark'

export type ThemePaletteInput = {
	bg: string
	bgLighter: string
	text: string
	primary: string
	secondary: string
	disabled: string
	divider: string
	muted: string
	dark: string
	light: string
	accent: string
	error: string
	warning: string
	info: string
	success: string
	low: string
	medium: string
	high: string
	critical: string
	black: string
	white: string
}

export type ThemePalette = ThemePaletteInput & {
	background: string
	backgroundAlt: string
	tint: string
	icon: string
	tabIconDefault: string
	tabIconSelected: string
	border: string
	card: string
	notification: string
	surface: string
}

const sharedColors = {
	dark: 'rgba(15, 15, 20, 1)',
	light: '#ffffff',
	accent: '#01FFFF',
	error: '#f60e08',
	warning: '#ff8000',
	info: '#0000ff',
	success: '#02ad21',
	low: '#fb850e',
	medium: '#ff8000',
	high: '#f60e08',
	critical: '#c50500',
	white: '#ffffff',
	black: '#000000',
} as const

export function createThemePalette(input: ThemePaletteInput): ThemePalette {
	return {
		...input,
		background: input.bg,
		backgroundAlt: input.bgLighter,
		tint: input.primary,
		icon: input.muted,
		tabIconDefault: input.muted,
		tabIconSelected: input.primary,
		border: input.divider,
		card: input.bgLighter,
		notification: input.error,
		surface: input.bgLighter,
	}
}

export const Colors = {
	light: createThemePalette({
		bg: '#f8f8f8',
		bgLighter: '#ffffff',
		text: '#2D2323',
		primary: '#2a42de',
		secondary: '#0051f2',
		disabled: '#bdbdbd',
		divider: '#DEDEDE',
		muted: '#C1C1C1',
		...sharedColors,
	}),
	dark: createThemePalette({
		bg: '#0f1214',
		bgLighter: '#242433',
		text: '#ffffff',
		primary: '#2a42de',
		secondary: '#0831a3',
		disabled: '#525456',
		divider: '#2B2B2B',
		muted: '#808080',
		...sharedColors,
	}),
}

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: 'system-ui',
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: 'ui-serif',
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: 'ui-rounded',
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
})
