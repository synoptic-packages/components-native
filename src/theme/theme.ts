import { Platform } from 'react-native'

import { MD3LightTheme } from 'react-native-paper'
import { fonts } from './fonts'
import { displayLetterSpacing } from './typography'

interface CustomFontStyles {
	bold: {
		fontFamily: string
		fontWeight: string
	}
	light: {
		fontFamily: string
		fontWeight: string
	}
	italic: {
		fontFamily: string
		fontWeight: string
	}
	regular: {
		fontFamily: string
		fontWeight: string
	}
	display: {
		fontFamily: string
		fontWeight: string
	}
}

export type AppTextVariant =
	| 'default'
	| 'bodySmall'
	| 'bodyMedium'
	| 'bodyLarge'
	| 'displaySmall'
	| 'displayMedium'
	| 'displayLarge'
	| 'headlineSmall'
	| 'headlineMedium'
	| 'headlineLarge'
	| 'titleSmall'
	| 'titleMedium'
	| 'titleLarge'
	| 'labelSmall'
	| 'labelMedium'
	| 'labelLarge'
	| 'bold'
	| 'light'
	| 'italic'
	| 'regular'

export const baseFont = {
	fontFamily: fonts.regular,
}

export const regularFontFamily = {
	ios: fonts.regular,
	android: fonts.regular,
	default: 'sans-serif',
}

export const boldFontFamily = {
	ios: fonts.bold,
	android: fonts.bold,
	default: 'sans-serif',
}

export const displayFontFamily = {
	ios: fonts.display,
	android: fonts.display,
	default: fonts.display,
}

export const labelFontFamily = {
	ios: fonts.label,
	android: fonts.label,
	default: 'sans-serif',
}

export const lightFontFamily = {
	ios: fonts.light,
	android: fonts.light,
	default: 'sans-serif',
}

export const wideFontFamily = {
	ios: fonts.wide,
	android: fonts.wide,
	default: 'sans-serif',
}

export const italicFontFamily = {
	ios: fonts.italic,
	android: fonts.italic,
	default: 'sans-serif',
}

/**
 * A variant set in the display face, with its tracking DERIVED from the size it ends up at.
 *
 * Deriving rather than stating it is the point: `displaySmall` below overrides MD3's 36 down to 32,
 * and a hand-written tracking value would have been computed for whichever size was current when
 * someone typed it and then silently outlived the next size change. Here the two cannot disagree.
 *
 * It also overrides MD3's own values, which are wrong for this face in both directions — MD3 gives
 * `titleMedium` +0.15 and `titleSmall` +0.1 (loosening, drawn for Roboto at reading sizes) and only
 * -0.25 at `displayLarge`, a flat number that does not follow the size.
 */
const displayFaceVariant = <T extends { fontSize: number }>(
	base: T,
	overrides: Record<string, unknown> = {}
): T & { letterSpacing: number } => {
	const merged = { ...base, ...overrides } as T & { fontSize: number }
	return { ...merged, letterSpacing: displayLetterSpacing(merged.fontSize) }
}

export const fontConfig: CustomFontStyles & any = {
	default: {
		...MD3LightTheme.fonts.default,
		fontFamily: Platform.select(regularFontFamily),
		includeFontPadding: false,
	},
	bodySmall: {
		...MD3LightTheme.fonts.bodySmall,
		fontFamily: Platform.select(regularFontFamily),
		includeFontPadding: false,
	},
	bodyLarge: {
		...MD3LightTheme.fonts.bodyLarge,
		fontFamily: Platform.select(regularFontFamily),
		includeFontPadding: false,
	},
	bodyMedium: {
		...MD3LightTheme.fonts.bodyMedium,
		fontFamily: Platform.select(regularFontFamily),
		includeFontPadding: false,
	},
	displaySmall: displayFaceVariant(MD3LightTheme.fonts.displaySmall, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
		fontSize: 32,
		lineHeight: 36,
	}),
	displayMedium: displayFaceVariant(MD3LightTheme.fonts.displayMedium, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
		fontSize: 36,
		lineHeight: 40,
	}),
	displayLarge: displayFaceVariant(MD3LightTheme.fonts.displayLarge, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
		fontSize: 48,
		lineHeight: 52,
	}),
	headlineSmall: displayFaceVariant(MD3LightTheme.fonts.headlineSmall, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
	}),
	headlineMedium: displayFaceVariant(MD3LightTheme.fonts.headlineMedium, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
		fontWeight: '700',
	}),
	headlineLarge: displayFaceVariant(MD3LightTheme.fonts.headlineLarge, {
		fontFamily: Platform.select(displayFontFamily),
		includeFontPadding: false,
		fontWeight: '700',
	}),
	titleSmall: displayFaceVariant(MD3LightTheme.fonts.titleSmall, {
		fontFamily: fonts.display,
		fontWeight: 800,
		includeFontPadding: false,
	}),
	titleMedium: displayFaceVariant(MD3LightTheme.fonts.titleMedium, {
		fontFamily: fonts.display,
		fontWeight: 800,
		includeFontPadding: false,
	}),
	titleLarge: displayFaceVariant(MD3LightTheme.fonts.titleLarge, {
		fontFamily: fonts.display,
		fontWeight: 800,
		includeFontPadding: false,
	}),
	labelSmall: {
		...MD3LightTheme.fonts.labelSmall,
		fontFamily: Platform.select(labelFontFamily),
	},
	labelMedium: {
		...MD3LightTheme.fonts.labelMedium,
		fontFamily: Platform.select(labelFontFamily),
	},
	labelLarge: {
		...MD3LightTheme.fonts.labelLarge,
		fontFamily: Platform.select(labelFontFamily),
	},
	bold: {
		...MD3LightTheme.fonts.labelSmall,
		fontFamily: fonts.bold,
	},
	light: {
		fontFamily: fonts.light,
	},
	italic: {
		fontFamily: fonts.italic,
		fontStyle: 'italic',
	},
	regular: {
		fontFamily: fonts.regular,
	},
	wide: {
		fontFamily: Platform.select(wideFontFamily),
		includeFontPadding: false,
	},
}
