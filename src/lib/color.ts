/**
 * WCAG contrast arithmetic — vendored from `@wallet/provider` (which is not available to this
 * package), semantics preserved 1:1 so components relying on it keep identical behaviour.
 *
 * "Is this label legible on this fill" is COMPUTED rather than listed, so a brand token change can
 * never silently produce unreadable text.
 */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const channelLuminance = (channel: number): number => {
	const value = channel / 255
	return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

const parseChannels = (color: string): [number, number, number] | null => {
	const value = String(color ?? '').trim()
	if (value.startsWith('#')) {
		const hex = value.slice(1)
		const normalized =
			hex.length === 3 || hex.length === 4
				? hex
						.slice(0, 3)
						.split('')
						.map((part) => `${part}${part}`)
						.join('')
				: hex.slice(0, 6)
		if (normalized.length !== 6 || !/^[0-9a-f]{6}$/i.test(normalized)) {
			return null
		}
		return [
			Number.parseInt(normalized.slice(0, 2), 16),
			Number.parseInt(normalized.slice(2, 4), 16),
			Number.parseInt(normalized.slice(4, 6), 16),
		]
	}
	const match = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(value)
	if (!match) {
		return null
	}
	return [
		clamp(Number(match[1]), 0, 255),
		clamp(Number(match[2]), 0, 255),
		clamp(Number(match[3]), 0, 255),
	]
}

const toHex = (channels: [number, number, number]): string =>
	`#${channels
		.map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0'))
		.join('')}`

/**
 * WCAG relative luminance, `0` (black) to `1` (white). `null` when the colour cannot be read.
 */
export const colorLuminance = (color: string): number | null => {
	const channels = parseChannels(color)
	if (!channels) {
		return null
	}
	const [red, green, blue] = channels
	return 0.2126 * channelLuminance(red) + 0.7152 * channelLuminance(green) + 0.0722 * channelLuminance(blue)
}

/**
 * WCAG contrast ratio between two colours, `1` (identical) to `21` (black on white). An unreadable
 * colour yields `1`, which is the safe answer.
 */
export const contrastRatio = (a: string, b: string): number => {
	const first = colorLuminance(a)
	const second = colorLuminance(b)
	if (first === null || second === null) {
		return 1
	}
	const lighter = Math.max(first, second)
	const darker = Math.min(first, second)
	return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Picks whichever candidate foreground is actually legible on `background`. Falls back to the first
 * candidate when the background cannot be read.
 */
export const preferredForeground = (background: string, light: string, dark: string): string => {
	if (colorLuminance(background) === null) {
		return light
	}
	return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark
}

/**
 * Blends `color` into `surface` by `amount` (0 = the surface, 1 = the colour) and returns an OPAQUE
 * hex.
 */
export const mixColors = (color: string, surface: string, amount: number): string => {
	const from = parseChannels(surface)
	const to = parseChannels(color)
	if (!from || !to) {
		return color
	}
	const weight = clamp(amount, 0, 1)
	return toHex([
		from[0] + (to[0] - from[0]) * weight,
		from[1] + (to[1] - from[1]) * weight,
		from[2] + (to[2] - from[2]) * weight,
	])
}

/** The WCAG AA floor for body text. */
export const CONTRAST_AA = 4.5

/**
 * Shades `foreground` toward black or white — whichever direction moves it away from `background` —
 * until it clears `minimum`, and returns it unchanged when it already does.
 */
export const ensureContrast = (foreground: string, background: string, minimum: number = CONTRAST_AA): string => {
	const channels = parseChannels(foreground)
	const backgroundLuminance = colorLuminance(background)
	if (!channels || backgroundLuminance === null) {
		return foreground
	}
	if (contrastRatio(foreground, background) >= minimum) {
		return foreground
	}
	const target = backgroundLuminance > 0.5 ? 0 : 255
	for (let step = 1; step <= 24; step += 1) {
		const amount = step / 24
		const shaded = toHex([
			channels[0] + (target - channels[0]) * amount,
			channels[1] + (target - channels[1]) * amount,
			channels[2] + (target - channels[2]) * amount,
		])
		if (contrastRatio(shaded, background) >= minimum) {
			return shaded
		}
	}
	return target === 0 ? '#000000' : '#ffffff'
}

/**
 * Applies an alpha value to hex or `rgb()` colors, returning the original value when the format is
 * not supported.
 */
export const withOpacity = (color: string, opacity: number): string => {
	if (color.startsWith('#')) {
		const value = color.slice(1)
		const normalized = value.length === 3 ? value.split('').map((part) => `${part}${part}`).join('') : value
		const red = Number.parseInt(normalized.slice(0, 2), 16)
		const green = Number.parseInt(normalized.slice(2, 4), 16)
		const blue = Number.parseInt(normalized.slice(4, 6), 16)
		return `rgba(${red}, ${green}, ${blue}, ${opacity})`
	}
	if (color.startsWith('rgb(')) {
		return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
	}
	return color
}
