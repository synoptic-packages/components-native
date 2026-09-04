import { Loader } from '../../loader/index'
import * as React from 'react'
import { useFormState, type FieldValues } from 'react-hook-form'

import { Button } from '../../button/index'
import { Divider } from '../../divider/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'

import { useForms } from '../../../hooks/useForms'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFormHeaderAction } from './context'
import { styles } from './styles'
import type { FormProps } from './types'

export const Component = <TFieldValues extends FieldValues = FieldValues>({
	size = 'medium',
	asModal: asModalProp,
	children,
	control,
	onSubmit,
	onReset,
	isLoading = false,
	isSubmitting: isSubmittingProp = false,
	submitDisabled = false,
	submitLabel = 'Submit',
	dividerLabel,
	resetLabel = 'Reset',
	hideReset = false,
	hideActions = false,
	endAdornment,
	testID = `form`,
}: FormProps<TFieldValues>) => {
	const { form } = useForms()
	const { colors } = useTheme()
	const { isSubmitting } = useFormState({ control })
	const { bottom } = useSafeAreaInsets()
	const keyboard = useKeyboard()
	const keyboardHeight = bottom + keyboard.keyboardHeight + 40
	const keyboardAware = keyboard?.keyboardShown ? keyboardHeight : bottom + 40
	const asModal = asModalProp ?? form?.asModal
	const loading = isLoading
	const submitting = isSubmitting || isSubmittingProp
	const showResetAction = !hideReset
	const showDivider = showResetAction && dividerLabel !== undefined
	const headerAction = useFormHeaderAction()
	// In a modal, ALSO surface the submit in the always-visible header so the
	// keyboard can never cover it. The descriptive footer submit stays as-is.
	const registerHeaderSubmit = Boolean(asModal && headerAction && !hideActions)
	const submitDisabledResolved = submitting || loading || submitDisabled

	React.useEffect(() => {
		if (!registerHeaderSubmit || !headerAction) return
		headerAction.setHeaderAction({
			label: 'Submit',
			onPress: onSubmit,
			loading: submitting,
			disabled: submitDisabledResolved,
		})
		return () => headerAction.setHeaderAction(null)
	}, [registerHeaderSubmit, headerAction, onSubmit, submitting, submitDisabledResolved])

	return (
		<React.Fragment>
			<View
				style={{
					...styles.outer,
					...(asModal && { borderRadius: 0 }),
					maxWidth: 400,
					width: '100%',
					backgroundColor: String(colors.bgLighter),
				}}>
				<View style={styles.content}>
					{loading ? (
						<View style={styles.loadingState}>
							<Loader size={48} color={`primary`} />
							<Text color={`muted`}>Preparing form…</Text>
						</View>
					) : (
						children({ control })
					)}
					<View height={32} />
					{!hideActions ? (
						<View style={styles.actions}>
							<Button
								mode={`contained`}
								size={`large`}
								width={`100%`}
								testID={`${testID}-submit`}
								loading={submitting}
								disabled={submitDisabledResolved}
								onPress={onSubmit}>
								{submitting ? ` ` : submitLabel}
							</Button>
							{showDivider ? <Divider color={`divider`} title={dividerLabel} /> : null}
							{showResetAction ? (
								<Button
									mode={`outlined`}
									size={`large`}
									width={`100%`}
									testID={`${testID}-reset`}
									disabled={submitting}
									onPress={onReset}>
									{loading ? 'Cancel' : resetLabel}
								</Button>
							) : null}
						</View>
					) : null}

					{endAdornment ? <View style={styles.endAdornment}>{endAdornment}</View> : null}
				</View>
			</View>
			<View height={keyboardAware} minHeight={keyboardAware} />
		</React.Fragment>
	)
}

Component.displayName = 'Form'
