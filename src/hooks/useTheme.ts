/**
 * Theme bridge: `useTheme()` + ColorName/StyleObject resolution.
 *
 * Adapted from the mobile app's `src/hooks/useTheme.ts` with three changes for package self-containment:
 *  1. `constants?.extra?.brand_color*` (expo app-config reads) are replaced by the config-free
 *     `lib/brand.ts` registry — see `setBrandColors()`.
 *  2. Secure storage for the scheme override is in-memory (module-level) instead of
 *     `expo-secure-store`/`@wallet/provider`, so the package pulls in no app storage dependency.
 *     Persistence is the host's job; it can re-apply `Appearance.setColorScheme` before mount.
 *  3. The tiny `log` helper is local rather than the app's `react-native-logs` logger.
 */
import { getBrandColors } from '../lib/brand'
import { colorsDark, colorsLight, type ColorName, type ThemeColors } from '../theme/colors'
import { useEffect, useMemo, useState } from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { MD3Theme, useTheme as useThemePaper } from 'react-native-paper'
import type { ColorScheme } from '../types'

const colorSchemeStorage = {
	get: async (): Promise<ColorScheme | undefined> => undefined,
	set: async (_value: ColorScheme | string): Promise<void> => {
		// Intentionally no-op: this package has no persistence dependency. Hosts that want the scheme to
		// survive relaunch re-apply it before this hook first reads it.
	},
	clear: async (): Promise<void> => {},
}

const log = {
	error: (..._args: unknown[]) => {
		// Swallow by default; the app's real logger is host-side.
	},
}

type ColorPropertyNames =
	| 'color'
	| 'backgroundColor'
	| 'fill'
	| 'borderColor'
	| 'borderTopColor'
	| 'borderBottomColor'
	| 'borderLeftColor'
	| 'borderRightColor'
	| 'overlayColor'
	| 'tintColor'

type StrictStyleValue = {
	[P in ColorPropertyNames]?: string
} & Record<string, any>

export type StyleObject = Record<string, StrictStyleValue>

export type ResolvedStyleObject<TStyles extends StyleObject> = {
	[Key in keyof TStyles]: any
}

interface UseThemeColorReturn {
	colorScheme: ColorScheme
	colors: ThemeColors
	setColorScheme: (newScheme: ColorScheme) => void
	toggleColorScheme: () => void
	isLoading: boolean
	isDark: boolean
	theme: MD3Theme
	setStylesheet: <TStyles extends StyleObject>(styles: TStyles) => ResolvedStyleObject<TStyles>
}

export function useTheme(): UseThemeColorReturn {
	const theme = useThemePaper()
	/**
	 * `useColorScheme()` is the ONE value every caller reads, and it is read on every render rather
	 * than seeded into local state — see the mobile source for the full rationale (finding 0091).
	 * `Appearance.setColorScheme` emits a change event that `useColorScheme()` subscribes to, so every
	 * caller re-renders in step with no shared context.
	 */
	const scheme = (useColorScheme() ?? Appearance.getColorScheme() ?? 'light') as ColorScheme
	const [isLoading, setIsLoading] = useState(true)
	const isDark = scheme !== 'light'
	const baseColors = useMemo(() => (isDark ? colorsDark : colorsLight), [isDark])

	const colors = useMemo(() => {
		const brand = getBrandColors()
		return {
			...baseColors,
			primary: brand.primary || baseColors.primary,
			accent: brand.accent || baseColors.accent,
		}
	}, [baseColors])

	useEffect(() => {
		const loadSavedTheme = async () => {
			try {
				const savedTheme = await colorSchemeStorage.get()
				if (savedTheme) {
					Appearance.setColorScheme(savedTheme)
				}
			} catch (error) {
				log.error(error)
			} finally {
				setIsLoading(false)
			}
		}

		loadSavedTheme()
	}, [])

	const setColorScheme = (newScheme: ColorScheme) => {
		if (!newScheme) return

		colorSchemeStorage.set(newScheme)

		try {
			Appearance.setColorScheme(newScheme)
		} catch (error) {
			log.error(`Failed to set appearance color scheme: ${error}`)
		}
	}

	const toggleColorScheme = () => {
		setColorScheme(scheme === 'light' ? 'dark' : 'light')
	}

	const setStylesheet = <TStyles extends StyleObject>(styles: TStyles): ResolvedStyleObject<TStyles> => {
		const processValue = <TValue>(value: TValue): any => {
			if (typeof value === 'string' && value in colors) {
				return colors[value as ColorName]
			}

			if (Array.isArray(value)) {
				return value.map(processValue)
			}

			if (typeof value === 'object' && value !== null) {
				return Object.entries(value).reduce(
					(acc, [key, val]) => {
						const next = acc as Record<string, any>
						next[key] = processValue(val)
						return acc
					},
					{} as Record<string, any>
				)
			}

			return value
		}

		return processValue(styles) as ResolvedStyleObject<TStyles>
	}

	return {
		theme,
		colorScheme: scheme,
		colors,
		setColorScheme,
		toggleColorScheme,
		isDark,
		isLoading,
		setStylesheet,
	}
}
