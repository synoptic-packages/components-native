import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { dateTimeClampToBounds, dateTimeCombine, dateTimeLabel, dateTimeRoundUpToStep, type DateTimeBounds } from '../../../lib/dateTime'
import React, { useCallback, useMemo, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { Platform } from 'react-native'

import { Button } from '../../button/index'
import { Chip } from '../../chip/index'
import { Modal } from '../../modal/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { TGeneric, ValidationRules } from '../../../types'
import { FieldComponent as FieldHelper } from '../../field/__helpers'

export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
	/** What an unset value reads as on the trigger. Unset is a real state, not an empty one. */
	nowLabel?: string
	/** Earliest selectable instant — a server-owned lead time, never a constant in a screen. */
	minimumDate?: Date | null
	/** Latest selectable instant — a server-owned horizon. */
	maximumDate?: Date | null
	/** Minute granularity of the time picker. */
	stepMinutes?: number
	/**
	 * Render the bare trigger with no `FieldHelper` wrapper, for a row of inline controls.
	 *
	 * The wrapper is `width: '100%'` with a full input `minHeight`, which is right for a stacked form
	 * and wrong beside a `flex={1}` sibling — it takes the row and collapses the other control.
	 */
	inline?: boolean
	/** Copy for the sheet's confirm/cancel/clear actions, so they can be translated by the caller. */
	confirmLabel?: string
	cancelLabel?: string
	clearLabel?: string
	sheetTitle?: string
	locale?: string
}

type AndroidStage = 'idle' | 'date' | 'time'

const DEFAULT_STEP_MINUTES = 5

/**
 * The shared date-and-time field.
 *
 * `FieldDate` is a masked TEXT input with a calendar glyph — a picture of a picker. This is the
 * picker, and it exists because a typed date is the wrong instrument for a pick-up time: the mask was
 * month-first once and a rider who typed 03/07 for 3 July was booked for 7 March. A spinner cannot
 * express that ambiguity.
 *
 * Three deliberate shapes:
 *
 * 1. **The trigger is a badge, not an input box.** It shows the current choice — `Now`, or the
 *    formatted pick-up — as the shared `Chip`, because that is what the value IS: a small chosen
 *    state, not a text entry. `FieldDate` remains for the cases where typing genuinely wins (a date
 *    of birth sixty years back is faster typed than spun).
 * 2. **iOS presents the picker in a bottom modal, never inline.** An inline iOS spinner has no
 *    dismiss affordance, which is the same trap `.maestro/README.md` records for the iOS number pad:
 *    the field has to be the last one entered or the keyboard/spinner never goes away. The shared
 *    `Modal` is used rather than the shared `BottomSheet` on purpose — a host surface may ITSELF be a
 *    gorhom bottom sheet, and a sheet inside a sheet fights its parent for the drag gesture and the
 *    backdrop. A modal over a sheet nests cleanly; a sheet over a sheet does not.
 * 3. **The value is an instant, not a display string.** Callers get a `Date` (or `null`), so no
 *    consumer re-parses a `DD/MM/YYYY` string and no consumer has to know the day-first rule.
 *
 * `null` means NOW and a `Date` means THEN. The field never substitutes the current time for an unset
 * value — that substitution is how a scheduled trip silently becomes an immediate one.
 */
export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	control,
	rules,
	nowLabel = `Now`,
	minimumDate,
	maximumDate,
	stepMinutes = DEFAULT_STEP_MINUTES,
	inline = false,
	confirmLabel = `Done`,
	cancelLabel = `Cancel`,
	clearLabel = `Ride now`,
	sheetTitle,
	locale,
}) => {
	const { isDark } = useTheme()
	const {
		field: { onChange, value },
	} = useController({ name, control, rules })

	const [isOpen, setIsOpen] = useState(false)
	const [androidStage, setAndroidStage] = useState<AndroidStage>('idle')
	const [draft, setDraft] = useState<Date | null>(null)

	const bounds = useMemo<DateTimeBounds>(
		() => ({ minimum: minimumDate, maximum: maximumDate }),
		[minimumDate, maximumDate]
	)

	const current = value instanceof Date ? value : null
	const triggerLabel = dateTimeLabel(current, { nowLabel, locale })

	/**
	 * The picker opens on the current choice, or — with nothing chosen — on the first instant the
	 * caller actually permits, snapped up to the step. Opening on "now" when the server requires a
	 * lead time offers a time that will be rejected on submit.
	 */
	const openingValue = useCallback((): Date => {
		if (current) return current
		const floor = minimumDate ?? new Date()
		return dateTimeRoundUpToStep(floor, stepMinutes)
	}, [current, minimumDate, stepMinutes])

	const commit = useCallback(
		(next: Date | null) => {
			onChange(next ? dateTimeClampToBounds(next, bounds) : null)
		},
		[bounds, onChange]
	)

	const open = useCallback(() => {
		if (disabled) return
		setDraft(openingValue())
		if (Platform.OS === 'android') {
			setAndroidStage('date')
			return
		}
		setIsOpen(true)
	}, [disabled, openingValue])

	// Android's pickers are already modal dialogs, and they are two of them — date, then time. The
	// dismiss event must clear the stage without writing anything: a cancelled picker leaves the
	// previous value alone rather than committing whatever the spinner happened to be showing.
	const onAndroidDate = useCallback((event: DateTimePickerEvent, picked?: Date) => {
		if (event.type !== 'set' || !picked) {
			setAndroidStage('idle')
			return
		}
		setDraft(picked)
		setAndroidStage('time')
	}, [])

	const onAndroidTime = useCallback(
		(event: DateTimePickerEvent, picked?: Date) => {
			setAndroidStage('idle')
			if (event.type !== 'set' || !picked) return
			commit(dateTimeCombine(draft, picked))
		},
		[commit, draft]
	)

	const onIosChange = useCallback((_event: DateTimePickerEvent, picked?: Date) => {
		if (picked) setDraft(picked)
	}, [])

	// The filter-pill treatment — the same `size="large"` + `selected` pair the rider home's
	// Home/Saved/Nearby row uses — so a row of chips reads as one set rather than as a pill beside a
	// status badge. `selected` means a pick-up time IS chosen; unselected is "Now", which is the true
	// resting state rather than a placeholder.
	const trigger = (
		<Chip
			testID={`field-${name}-trigger`}
			icon={`Clock`}
			iconFamily={`Lucide`}
			size={`large`}
			selected={Boolean(current)}
			label={triggerLabel}
			accessibilityLabel={typeof triggerLabel === 'string' ? triggerLabel : undefined}
			disabled={disabled}
			onPress={open}
		/>
	)

	return (
		<>
			{/*
			    Two presentations, one implementation — the same shape the form system uses for
			    inline-vs-modal. INLINE is a bare chip for a row of controls; the default wraps it in
			    the shared `FieldHelper` for form use (label, error, hint).

			    The wrapper is `width: '100%'` with a full `minHeight` (`field/__helpers.styles.ts`),
			    which is correct for a stacked form and wrong inside a flex row: it consumed the whole
			    width and collapsed the sibling `flex={1}` control next to it. That is what broke the
			    home's "Where to?" row, and it is why `inline` exists rather than a second component.
			*/}
			{inline ? (
				trigger
			) : (
				<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
					<View flexDirection={`row`} alignItems={`center`} paddingVertical={4}>
						{trigger}
					</View>
				</FieldHelper>
			)}

			{androidStage === 'date' ? (
				<DateTimePicker
					testID={`field-${name}-android-date`}
					value={draft ?? openingValue()}
					mode={`date`}
					minimumDate={minimumDate ?? undefined}
					maximumDate={maximumDate ?? undefined}
					onChange={onAndroidDate}
				/>
			) : null}

			{androidStage === 'time' ? (
				<DateTimePicker
					testID={`field-${name}-android-time`}
					value={draft ?? openingValue()}
					mode={`time`}
					minuteInterval={stepMinutes as never}
					onChange={onAndroidTime}
				/>
			) : null}

			<Modal isVisible={isOpen} setIsVisible={setIsOpen} onBackdropPress={() => setIsOpen(false)}>
				<View flex={1} justifyContent={`flex-end`} testID={`field-${name}-sheet`}>
					<View
						backgroundColor={`bg`}
						borderTopLeftRadius={20}
						borderTopRightRadius={20}
						paddingHorizontal={20}
						paddingTop={16}
						paddingBottom={28}
						gap={12}>
						{sheetTitle ? (
							<Text variant={`titleMedium`} align={`center`}>
								{sheetTitle}
							</Text>
						) : null}

						{/*
							The iOS spinner's font is system-controlled with no direct size prop. A scale
							transform shrinks the whole picker visually; negative vertical margins
							compensate for the frame the original size still occupies in layout.

							The picker's intrinsic height is ~216 pt; 0.78 scale → ~168 pt visual,
							leaving ~48 pt to reclaim (~24 pt per side).
						*/}
						<View marginVertical={-24} alignItems={`center`} style={{ transform: [{ scale: 0.78 }] }}>
							<DateTimePicker
								testID={`field-${name}-picker`}
								value={draft ?? openingValue()}
								mode={`datetime`}
								display={`spinner`}
								minimumDate={minimumDate ?? undefined}
								maximumDate={maximumDate ?? undefined}
								minuteInterval={stepMinutes as never}
								themeVariant={isDark ? `dark` : `light`}
								onChange={onIosChange}
							/>
						</View>

						<View flexDirection={`row`} justifyContent={`space-between`} gap={12}>
							{current ? (
								<Button
									testID={`field-${name}-clear`}
									mode={`outlined`}
									style={{ flexGrow: 1 }}
									onPress={() => {
										commit(null)
										setIsOpen(false)
									}}>
									{clearLabel}
								</Button>
							) : (
								<Button
									testID={`field-${name}-confirm`}
									style={{ flexGrow: 1 }}
									onPress={() => {
										commit(draft)
										setIsOpen(false)
									}}>
									{confirmLabel}
								</Button>
							)}
							<Button
								testID={`field-${name}-cancel`}
								style={{ flexGrow: 1 }}
								mode={`outlined`}
								onPress={() => setIsOpen(false)}>
								{cancelLabel}
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</>
	)
}
