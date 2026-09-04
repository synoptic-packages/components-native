/**
 * Date/date-time helpers for picker fields — vendored from `@wallet/provider` (unavailable to this
 * package), semantics preserved 1:1 so `FieldDateTime` behaves identically.
 */

export interface DateTimeBounds {
	minimum?: Date | null
	maximum?: Date | null
}

export interface DateTimeLabelOptions {
	/** What an unset value reads as. Supplied by the caller so it can be translated. */
	nowLabel: string
	locale?: string
}

const isValidDate = (value: unknown): value is Date => value instanceof Date && Number.isFinite(value.getTime())

/**
 * Combines a day and a time into a single instant. Seconds are dropped so two identical user choices
 * compare equal.
 */
export const dateTimeCombine = (
	day: Date | null | undefined,
	time: Date | null | undefined
): Date | null => {
	if (!isValidDate(day)) return null
	const combined = new Date(day.getTime())
	if (isValidDate(time)) {
		combined.setHours(time.getHours(), time.getMinutes(), 0, 0)
	} else {
		combined.setHours(0, 0, 0, 0)
	}
	return combined
}

/** Inclusive at both ends; an absent bound imposes no restriction. */
export const dateTimeIsWithinBounds = (
	value: Date | null | undefined,
	bounds: DateTimeBounds
): boolean => {
	if (!isValidDate(value)) return false
	if (isValidDate(bounds.minimum) && value.getTime() < bounds.minimum.getTime()) return false
	if (isValidDate(bounds.maximum) && value.getTime() > bounds.maximum.getTime()) return false
	return true
}

/**
 * Pulls a value inside the bounds instead of rejecting it. Null passes through untouched.
 */
export const dateTimeClampToBounds = (
	value: Date | null | undefined,
	bounds: DateTimeBounds
): Date | null => {
	if (!isValidDate(value)) return null
	if (isValidDate(bounds.minimum) && value.getTime() < bounds.minimum.getTime())
		return new Date(bounds.minimum.getTime())
	if (isValidDate(bounds.maximum) && value.getTime() > bounds.maximum.getTime())
		return new Date(bounds.maximum.getTime())
	return value
}

/**
 * Snaps up to the next step boundary. Uses `setMinutes` past 59 deliberately — `Date` rolls the hour
 * and the day for us.
 */
export const dateTimeRoundUpToStep = (value: Date, stepMinutes: number): Date => {
	const rounded = new Date(value.getTime())
	rounded.setSeconds(0, 0)
	if (stepMinutes <= 1) return rounded
	const remainder = rounded.getMinutes() % stepMinutes
	if (remainder === 0) return rounded
	rounded.setMinutes(rounded.getMinutes() + (stepMinutes - remainder))
	return rounded
}

/**
 * The trigger's label. An unset or invalid value reads as the caller's "now" copy.
 */
export const dateTimeLabel = (
	value: Date | null | undefined,
	options: DateTimeLabelOptions
): string => {
	if (!isValidDate(value)) return options.nowLabel
	return value.toLocaleString(options.locale, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	})
}
