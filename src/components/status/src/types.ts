import type { TGeneric } from '../../../types'

export interface StatusAction {
	/**
	 * Navigation target, resolved by the host via `onNavigate`. The ventry
	 * source called `router.push` directly; the library stays
	 * navigation-agnostic (same rule as `Link`).
	 */
	path?: string
	label: string
	variant?: 'text' | 'outlined' | 'contained'
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
	onClick?: () => void | Promise<void>
}

export interface StatusErrorProps {
	title?: string
	subTitle?: string
	objectNumber?: string
	actions?: StatusAction[]
	testID?: string
	/** Host navigation (e.g. `(path) => router.push(path)`). */
	onNavigate?: (_path: string) => void | Promise<void>
	/** Host dismiss (replaces ventry's `router.back()` Close button). */
	onClose?: () => void | Promise<void>
}

export interface StatusSuccessProps {
	title?: string
	subTitle?: string
	objectNumber?: string
	actions?: StatusAction[]
	testID?: string
	/** Host navigation (e.g. `(path) => router.push(path)`). */
	onNavigate?: (_path: string) => void | Promise<void>
}

export interface StatusLocationState extends TGeneric {
	title?: string
	subTitle?: string
	objectNumber?: string
	actions?: StatusAction[]
}
