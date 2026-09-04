/**
 * Pure currency-input helpers for amount fields.
 *
 * Vendored from the mobile app's `src/utils/currencyAmountInput.ts` with the single
 * `@wallet/provider` import replaced by this package's local `currencyMinorUnits`.
 */
import { currencyMinorUnits } from '../lib/currency'

/** The scale a currency actually has: 0 for UGX/RWF, 3 for KWD, 2 for most. */
export const amountScaleFor = (currencyCode?: string | null): number => currencyMinorUnits(currencyCode)

/**
 * Sanitize a keystroke-in-progress. Returns TEXT, deliberately — `5.` and `5.0` are valid things to be
 * partway through typing, and both round-trip to `5` as a number.
 */
export const sanitizeAmountText = (input: string, scale: number): string => {
	const digitsAndSeparators = String(input ?? '').replace(/[^0-9.]/g, '')
	if (scale <= 0) {
		return digitsAndSeparators.replace(/\./g, '')
	}
	const [whole, ...rest] = digitsAndSeparators.split('.')
	if (rest.length === 0) return whole
	return `${whole}.${rest.join('').slice(0, scale)}`
}

/** The parsed value for the form. `null` rather than `0` for empty. */
export const parseAmountText = (text: string): number | null => {
	if (text === '' || text === '.') return null
	const parsed = Number.parseFloat(text)
	return Number.isFinite(parsed) ? parsed : null
}

/**
 * Re-fit an amount to a different currency's scale. This is NOT `sanitizeAmountText`: a currency
 * switch re-fits the NUMBER, so 5.75 becomes 6 at scale 0, never 575.
 */
export const clampAmountToScale = (value: number | null, scale: number): number | null => {
	if (value == null || !Number.isFinite(value)) return null
	const factor = 10 ** Math.max(0, scale)
	return Math.round(value * factor) / factor
}

/** The placeholder for a currency, rather than a hardcoded `0.00`. */
export const amountPlaceholderFor = (scale: number): string => (scale <= 0 ? '0' : `0.${'0'.repeat(scale)}`)

/** A zero-decimal currency has no use for a decimal key, so it gets the plain number pad. */
export const amountKeyboardFor = (scale: number): 'decimal-pad' | 'number-pad' =>
	scale <= 0 ? 'number-pad' : 'decimal-pad'
