/**
 * Phone number international-format helper — vendored from `@wallet/provider` (unavailable to this
 * package), semantics preserved (the provider implementation delegates to `libphonenumber-js`).
 */
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import type { PhoneNumberInterface } from '../types'

/**
 * Parses and formats a phone number into national and international display forms.
 */
export const phoneNumberGetInternationalString = (
	phoneNumberObject: PhoneNumberInterface
): { national: string | undefined; international: string | undefined; countryCode: string } | undefined => {
	if (!phoneNumberObject) return undefined
	const { national, international, countryCode } = phoneNumberObject
	if (!countryCode) return undefined
	const input = international || national
	if (!input) return undefined

	let parsed
	try {
		parsed = parsePhoneNumberFromString(input, countryCode as Parameters<typeof parsePhoneNumberFromString>[1])
	} catch {
		return undefined
	}
	if (!parsed) return undefined

	return {
		national: parsed.formatNational(),
		international: parsed.formatInternational(),
		countryCode: String(countryCode),
	}
}
