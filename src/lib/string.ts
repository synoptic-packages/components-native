/**
 * Tiny string helpers vendored from `@wallet/provider` (unavailable to this package), semantics
 * preserved so copied components behave identically.
 */

/** Truncates text to a maximum number of characters and appends an ellipsis when it exceeds the limit. */
export const truncate = (str: string, limit: number = 80): string => {
	if (str && str.length > limit) {
		return `${str.substring(0, limit)}${str.length >= limit ? '...' : ''}`
	}
	return str
}

/** Returns the original string value or an empty string for non-string values. */
export const toStringOrEmpty = (value: unknown): string => (typeof value === 'string' ? value : '')

/** Uppercases a string, returning an empty string for nullish runtime values. */
export const upperCase = (value: string | null | undefined): string => value?.toUpperCase() ?? ''

/** Lowercases a string, returning an empty string for nullish runtime values. */
export const lowerCase = (value: string | null | undefined): string => value?.toLowerCase() ?? ''

/** Builds up to two initials from a display name. */
export const initials = (name: unknown): string => {
	const normalized = typeof name === 'string' ? name.trim().replace(/-/g, '').replace(/,/g, '') : ''
	if (!normalized) return ''

	try {
		const parts = normalized.split(' ')
		if (parts.length >= 2) {
			const init = parts
				.map((p) => Array.from(p)[0])
				.join('')
				.toUpperCase()
				.substring(0, 2)
			return init || ''
		}
		const chars = Array.from(normalized)
		if (chars.length >= 2) {
			return (chars[0] + chars[1]).toUpperCase()
		}
		return chars[0]?.toUpperCase() ?? ''
	} catch {
		return ''
	}
}
