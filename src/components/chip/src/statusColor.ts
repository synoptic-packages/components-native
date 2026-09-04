import type { ChipColor } from './Component'

/**
 * Universal backend-status → semantic chip color map.
 *
 * Backend statuses (wallet transactions, orders, splits, withdrawals, KYC,
 * memberships, merchants, transfer requests) are matched case-insensitively to
 * one of the shared Chip tones so every status renders as a consistent badge.
 */
const SUCCESS = new Set([
	'COMPLETED',
	'APPROVED',
	'PAID',
	'ACTIVE',
	'CONFIRMED',
	'SETTLED',
	'ACCEPTED',
	'RECEIVED',
	'VERIFIED',
])
const ERROR = new Set(['CANCELLED', 'CANCELED', 'REJECTED', 'FAILED', 'DECLINED', 'EXPIRED', 'BLOCKED', 'REVOKED'])
const WARNING = new Set([
	'PENDING',
	'AWAITING_PAYMENT',
	'AWAITING_REVIEW',
	'AWAITING',
	'POSTING',
	'PROCESSING',
	'IN_REVIEW',
	'ON_HOLD',
	'HELD',
])
const INFO = new Set(['REFUNDED', 'REVERSED', 'RELEASED', 'CONSUMED'])

export const statusChipColor = (status: string | null | undefined): ChipColor => {
	const key = String(status ?? '')
		.trim()
		.toUpperCase()
	if (SUCCESS.has(key)) return 'success'
	if (ERROR.has(key)) return 'error'
	if (WARNING.has(key)) return 'warning'
	if (INFO.has(key)) return 'info'
	return 'default'
}

/**
 * The same status map, as a TEXT tone.
 *
 * A list row states its status in the subtitle, not as a filled badge stacked under the title: a
 * chip below the title makes every row two blocks tall and turns a clean list into a column of
 * cards. Colour ranks the status; the badge shape adds nothing a list needs.
 *
 * `info` and `default` both resolve to `muted`, deliberately. `info` is a fixed royal blue that
 * appears nowhere else in the product, and a REFUNDED row is supporting information rather than
 * something to draw the eye to.
 */
export const statusTextColor = (status: string | null | undefined): 'success' | 'error' | 'warning' | 'muted' => {
	const tone = statusChipColor(status)
	if (tone === 'success') return 'success'
	if (tone === 'error') return 'error'
	if (tone === 'warning') return 'warning'
	return 'muted'
}
