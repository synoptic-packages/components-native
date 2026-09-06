import { useMemo } from 'react'

export interface PasswordColors {
	error: string
	warning: string
	info: string
	success: string
	transparent: string
}

export interface PasswordLabels {
	veryWeak: string
	weak: string
	good: string
	strong: string
}

export interface PasswordStrength {
	score: number
	label: string
	color: string
	percentage: number
	progress: number
	checks: {
		hasLowercase: boolean
		hasUppercase: boolean
		hasNumber: boolean
		hasMinLength: boolean
		hasSpecialChar: boolean
	}
}

const defaultColors: PasswordColors = {
	error: '#d32f2f',
	warning: '#ed6c02',
	info: '#0288d1',
	success: '#2e7d32',
	transparent: 'transparent',
}

const defaultLabels: PasswordLabels = {
	veryWeak: 'Very Weak',
	weak: 'Weak',
	good: 'Good',
	strong: 'Strong',
}

/**
 * Password strength meter hook.
 *
 * Ported from the wallet provider for package self-containment: identical
 * scoring (five checks → 0–4 score, colour ramp error/warning/info/success)
 * and the same strict `isValidPassword` rule. Hosts override copy and colours
 * per call; labels additionally flow through the host i18n at the call site.
 */
export function usePassword(
	password: string = '',
	colors: Partial<PasswordColors> = {},
	labels: Partial<PasswordLabels> = {}
): { passwordStrength: PasswordStrength; isValidPassword: boolean } {
	const mergedColors = useMemo(() => ({ ...defaultColors, ...colors }), [colors])
	const mergedLabels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])

	const passwordStrength = useMemo<PasswordStrength>(() => {
		const hasLowercase = /[a-z]/.test(password)
		const hasUppercase = /[A-Z]/.test(password)
		const hasNumber = /[0-9]/.test(password)
		const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
		const hasMinLength = password.length >= 8
		const checks = { hasLowercase, hasUppercase, hasNumber, hasMinLength, hasSpecialChar }
		const passedChecks = Object.values(checks).filter(Boolean).length
		const totalChecks = Object.values(checks).length
		let score = 0
		let label = ''
		if (password.length === 0) {
			score = 0
			label = ''
		} else if (passedChecks <= 1) {
			score = 1
			label = mergedLabels.veryWeak
		} else if (passedChecks === 2) {
			score = 2
			label = mergedLabels.weak
		} else if (passedChecks === 3) {
			score = 3
			label = mergedLabels.good
		} else if (passedChecks >= 4) {
			score = 4
			label = mergedLabels.strong
		}
		const percentage = password.length === 0 ? 0 : (passedChecks / totalChecks) * 100
		const progress = password.length === 0 ? 0 : passedChecks / totalChecks
		let color = ''
		if (password.length === 0) {
			color = mergedColors.transparent
		} else if (score <= 1) {
			color = mergedColors.error
		} else if (score === 2) {
			color = mergedColors.warning
		} else if (score === 3) {
			color = mergedColors.info
		} else {
			color = mergedColors.success
		}
		return { score, label, color, percentage, progress, checks }
	}, [password, mergedColors, mergedLabels])

	const isValidPassword = useMemo(() => {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
		return regex.test(password)
	}, [password])

	return { passwordStrength, isValidPassword }
}
