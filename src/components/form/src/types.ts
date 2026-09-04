import type { ReactNode } from 'react'
import type { Control, FieldValues } from 'react-hook-form'

export type FormSize = 'small' | 'medium' | 'full'

export interface FormHeaderAction {
	label: string
	onPress?: () => Promise<void> | void
	disabled?: boolean
	loading?: boolean
	accessibilityLabel?: string
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
	size?: FormSize
	asModal?: boolean
	children: (_props: { control: Control<TFieldValues> }) => ReactNode
	control: Control<TFieldValues>
	onSubmit?: () => Promise<void> | void
	onReset?: () => void
	isLoading?: boolean
	isSubmitting?: boolean
	submitDisabled?: boolean
	submitLabel?: string
	dividerLabel?: string
	resetLabel?: string
	hideReset?: boolean
	hideActions?: boolean
	endAdornment?: ReactNode
	testID?: string
}
