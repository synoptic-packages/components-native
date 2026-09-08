import type { Control } from 'react-hook-form'
import type { TGeneric, ValidationRules } from '../../../types'

export type FieldRoutePlace = TGeneric

export interface FieldRouteValue {
	origin: FieldRoutePlace | null
	destination: FieldRoutePlace | null
	stops: (FieldRoutePlace | null)[]
}

export interface FieldRouteProps {
	name: string
	control: Control<TGeneric> | TGeneric
	/** Active account id threaded to the composed place fields for the backend geo contract. */
	accountId?: string
	originLabel?: string
	destinationLabel?: string
	originPlaceholder?: string
	destinationPlaceholder?: string
	stopPlaceholder?: string
	addStopLabel?: string
	/** Forwarded verbatim to every composed place field — see `FieldPlaces`. */
	outOfAreaMessage?: string
	allowStops?: boolean
	maxStops?: number
	allowSwap?: boolean
	disabled?: boolean
	rules?: ValidationRules
}
