import type { GeoAutocompletePurpose } from '@wallet/provider'
import type { Control } from 'react-hook-form'
import type { ValidationRules, TGeneric } from '../../../types'

export interface FieldComponentProps {
	name: string
	hint?: string
	disabled?: boolean
	label?: string
	placeholder?: string
	rules?: ValidationRules
	control: Control<TGeneric> | TGeneric
	debounceMs?: number
	/** Active account id required by the backend geo autocomplete/resolve contract. */
	accountId?: string
	/** Geo search intent forwarded to the backend; defaults to a mobility destination search. */
	purpose?: GeoAutocompletePurpose
	/**
	 * What a suggestion `be/` has marked outside the market's service area says — in place of its
	 * address on the row, and again when the row is tapped.
	 *
	 * Passed in rather than translated here, like every other label on this field. A caller should
	 * pass the SERVER's own refusal copy so the rider reads the same sentence whether the place is
	 * rejected at selection or at quote time.
	 */
	outOfAreaMessage?: string
}
