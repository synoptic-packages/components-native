import type { ThemeColors } from '../theme/colors'

export function resolveColor(value: string, colors: ThemeColors): string {
	if (value in colors) {
		return colors[value as keyof ThemeColors] as string
	}

	return value
}
