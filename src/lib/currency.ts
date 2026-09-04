/**
 * Currency formatting and minor-unit helpers — vendored from `@wallet/provider` (unavailable to this
 * package), semantics preserved.
 *
 * ISO 4217 minor-unit exponents are a published standard, carried here as a static table so a UGX/RWF
 * amount (exponent 0) or a KWD amount (exponent 3) is never divided by 100 by mistake.
 */

const ZERO_DECIMAL = new Set([
	'BIF',
	'CLP',
	'DJF',
	'GNF',
	'ISK',
	'JPY',
	'KMF',
	'KRW',
	'MGA',
	'PYG',
	'RWF',
	'UGX',
	'VND',
	'VUV',
	'XAF',
	'XOF',
	'XPF',
])

const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'])

export const CURRENCY_DEFAULT_MINOR_UNITS = 2

/** The number of decimal places `<currencyCode>` is written with. Unknown codes get the 2-dp default. */
export const currencyMinorUnits = (currencyCode?: string | null): number => {
	const code = String(currencyCode ?? '').trim().toUpperCase()
	if (!code) return CURRENCY_DEFAULT_MINOR_UNITS
	if (ZERO_DECIMAL.has(code)) return 0
	if (THREE_DECIMAL.has(code)) return 3
	return CURRENCY_DEFAULT_MINOR_UNITS
}

/** Minor units (what a backend stores and every `*Minor` field carries) to the major figure a person reads. */
export const minorToMajor = (minor: number | null | undefined, currencyCode?: string | null): number => {
	const value = Number(minor)
	if (!Number.isFinite(value)) return 0
	return value / 10 ** currencyMinorUnits(currencyCode)
}

/** A major figure a person typed to the integer minor units a backend accepts. Rounds, returns an integer. */
export const majorToMinor = (major: number | string | null | undefined, currencyCode?: string | null): number => {
	const value = Number(major)
	if (!Number.isFinite(value)) return 0
	return Math.round(value * 10 ** currencyMinorUnits(currencyCode))
}

/** Formats a numeric value with thousands separators. */
export const currencyMask = (number: unknown, precision: number = 2): string => {
	let value = Number(number || 0)
	const factor = 10 ** precision
	value = Math.round((value + Number.EPSILON) * factor) / factor
	const [whole, fraction] = value.toFixed(precision).split('.')
	const rgx = /(\d+)(\d{3})/
	let x1 = whole
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1,$2')
	}
	return fraction ? `${x1}.${fraction}` : x1
}

/**
 * Looks up a currency symbol by ISO currency code from the bundled currency list (see
 * `../constants/currencies.json`).
 */
export const currencySymbol = (currencyCode?: string | null): string | undefined => {
	// Lazy require keeps the JSON import out of this module's static graph so the file can be used in
	// environments that only want the minor-unit arithmetic.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const currencies: { code: string; symbol: string }[] = require('../constants/currencies.json')
	const currency = currencies.find(
		(o) => o?.code?.toLowerCase() === (currencyCode ?? '').toLowerCase()
	)
	return currency?.symbol
}

/**
 * Formats an amount for display: symbol-prefixed masked figure (`R269.00`) when the currency symbol
 * resolves, otherwise the bare masked figure. Decimal count follows the currency.
 */
export const currencyDisplay = (value: unknown, currencyCode?: string): string => {
	const masked = currencyMask(value, currencyMinorUnits(currencyCode))
	const symbol = currencyCode ? currencySymbol(currencyCode) : undefined
	return symbol ? `${symbol}${masked}` : masked
}

/** Parses a currency-like string or number into a fixed two-decimal string. */
export const currencyParse = (input: string | number): string => {
	try {
		const number = parseFloat(input.toString().split(/[^0-9.|]+/).join(''))
		return parseFloat(number.toString()).toFixed(2).toString()
	} catch {
		return parseFloat(input.toString()).toFixed(2).toString()
	}
}

/** Appends one digit; keystrokes pushing past the safe-integer range are ignored. */
export const amountPadDigit = (minor: number, digit: number): number => {
	if (!Number.isInteger(digit) || digit < 0 || digit > 9) {
		return minor
	}
	const current = Number.isSafeInteger(minor) && minor > 0 ? minor : 0
	const next = current * 10 + digit
	return Number.isSafeInteger(next) && next <= Number.MAX_SAFE_INTEGER ? next : current
}

/** Removes the rightmost digit. Backspacing an empty amount stays at zero. */
export const amountPadBackspace = (minor: number): number => {
	const current = Number.isSafeInteger(minor) && minor > 0 ? minor : 0
	return Math.floor(current / 10)
}

/** Long-press backspace. */
export const amountPadClear = (): number => 0
