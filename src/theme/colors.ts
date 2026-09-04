export type T = Record<string, any> | string | number | boolean | null | undefined | any

export interface ThemeColors {
	bg: string | T
	bgLighter: string | T
	text: string | T
	primary: string | T
	secondary: string | T
	accent: string | T
	error: string | T
	warning: string | T
	info: string | T
	success: string | T
	disabled: string | T
	divider: string | T
	muted: string | T
	mutedLight: string | T
	mutedDark: string | T
	modalOpacity: string | T
	dark: string | T
	light: string | T
	low: string | T
	medium: string | T
	high: string | T
	critical: string | T
	white: string | T
	black: string | T
	transparent: string | T
}

export type ColorName = keyof ThemeColors

export const colors: Pick<
	ThemeColors,
	| 'dark'
	| 'light'
	| 'accent'
	| 'error'
	| 'warning'
	| 'info'
	| 'success'
	| 'low'
	| 'medium'
	| 'high'
	| 'critical'
	| 'white'
	| 'black'
	| 'transparent'
> = {
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
	transparent: 'transparent',
}

export const colorsDark: ThemeColors = {
	bg: '#0f1214',
	bgLighter: '#1b1b24',
	text: '#ffffff',
	primary: '#2a42de',
	secondary: '#0831a3',
	disabled: '#525456',
	divider: 'rgba(255, 255, 255, 0.15)',
	muted: 'rgb(127, 127, 127)',
	mutedLight: 'rgba(255, 255, 255, 0.15)',
	mutedDark: 'rgba(210,210,210, 0.2)',
	modalOpacity: 'rgba(0,0,0,0.85)',
	...colors,
}

export const colorsLight: ThemeColors = {
	bg: '#f6f6f6',
	bgLighter: '#ffffff',
	text: '#2D2323',
	primary: '#2a42de',
	secondary: '#0051f2',
	disabled: '#bdbdbd',
	divider: 'rgba(0, 0, 0, 0.15)',
	muted: '#adadad',
	mutedLight: 'rgba(0, 0, 0, 0.08)',
	mutedDark: 'rgba(210,210,210, 0.6)',
	modalOpacity: 'rgba(0,0,0,0.5)',
	...colors,
}
