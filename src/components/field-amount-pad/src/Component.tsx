import { ModalAmountPad } from '../../modal/index'
import { Money } from '../../money/index'
import { Pressable } from '../../pressable/index'
import { QuickAction } from '../../quick-action/index'
import { View } from '../../view/index'
import type { ColorName } from '../../../constants/index'
import { TGeneric, ValidationRules } from '../../../types'
import React, { useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { FieldComponent as FieldHelper } from '../../field/__helpers'

/**
 * `FieldAmountPad` — a prominent money figure with `−`/`+` beside it and its own keypad behind it.
 *
 * **This field exists under an explicit authorization.** _The Existing Design System Is Law_ prohibits
 * new fields, and its own escape clause is that one may be added when creation is explicitly authorized.
 * That authorization was given by the constitution's author on 2026-08-01 for this component
 * specifically (.project/spec/023-yaya-fare-bidding §4.1). It is **not precedent**: the next new primitive needs its
 * own authorization, exactly like this one did.
 *
 * It is named for what it is rather than for bidding, because amount entry with a custom pad is equally
 * the right instrument for a top-up or a send — but it is built once, here, and adopted elsewhere only
 * deliberately.
 *
 * **One component, two presentations, one value.** The inline control and the keypad are not two things
 * wired together: the modal is this field's own editing surface, opened from its inline presentation,
 * writing the same `useController` value. There is no separate stepper, no registered modal form, and
 * nothing to keep in sync — which is exactly why opening the pad, typing, and closing it can only ever
 * leave one value. `FieldSelect` is the benchmark for that shape and this follows it.
 *
 * **Two deliberate deviations from that benchmark**, stated so a reviewer does not read them as
 * oversights: `FieldSelect`'s trigger is a read-only Paper `TextInput` styled to look like a field row —
 * this renders no `TextInput` at all, because a prominent money figure must not look like one. And
 * `FieldSelect` reuses `ModalFormField`, which is a searchable option LIST; a pad is not a list, so it
 * cannot reuse it.
 *
 * **Value semantics — integer minor units, always.** Never a float and never a display string, matching
 * the money path end to end. Entry is fill-from-the-right, as on an ATM, so there is no decimal
 * separator to localize and nothing to parse; `Money` owns the currency's real exponent, which is why a
 * zero-decimal currency needs no special case here.
 *
 * **It raises no system keyboard, and that is a benefit.** The iOS number-pad caveat in
 * `.maestro/README.md` — a number-pad field exposes no dismiss action, so it must be the last field
 * entered — does not apply to this component at all. There is no keyboard to dismiss, no `hideKeyboard`
 * between fields, and no ordering constraint on an acceptance flow.
 */
export interface FieldComponentProps {
	name: string
	hint?: string
	label?: string
	disabled?: boolean
	currencyCode: string
	/**
	 * The inline `−`/`+` increment. Omit to hide those controls entirely.
	 *
	 * `steps` overrides it where the legal amounts are not a uniform ladder — a server-issued band whose
	 * standard fare does not sit on its own grid, for instance. When `steps` is supplied the controls
	 * walk that list; `stepMinor` then only decides whether they are rendered.
	 */
	stepMinor?: number
	/** The exact legal amounts, ascending. The `−`/`+` controls walk these and disable at the ends. */
	steps?: number[]
	/** Minor values offered as one-tap chips inside the pad. */
	presets?: number[]
	/**
	 * The `−`/`+` circle surface. Defaults to `bg`, which reads on a `bgLighter` host. Pass the
	 * opposite when the field sits on a `bg` card, or the circles disappear into it — the two surface
	 * tokens are one step apart by design, and the control has no way to see what it is sitting on.
	 */
	controlColor?: ColorName
	/**
	 * Fired once, with the settled amount, when the keypad CLOSES.
	 *
	 * The reason it exists: a caller that needs to react to the entered amount — quote it, price it,
	 * check it against a server — has no other signal, because the field's value updates on every
	 * keystroke. Callers were left debouncing the watched form value, and a debounce that lands while
	 * the modal is still open re-renders this component mid-dismissal and the modal is stranded open,
	 * with its Done control already tapped. That is not a caller bug: the field owns the modal, so the
	 * field owes callers a "the user has finished" event. Reproduced on device and recorded as finding
	 * 0131.
	 *
	 * It is deliberately NOT a second value channel — `control`/`name` remain the only source of the
	 * amount. This says WHEN, not WHAT.
	 */
	onCommit?: (minor: number) => void
	left?: React.ReactNode
	control: Control<TGeneric> | TGeneric
	rules?: ValidationRules
}

/**
 * The `−`/`+` circles. `QuickAction` is the shared circular icon control this app already uses for its
 * money verbs, so the pair is composed from it rather than from a local `Pressable` — a feature-local
 * visual wrapper is exactly what the design system forbids, and reusing it means the disabled state,
 * the accessible label and the icon sizing all come from one place.
 *
 * The circle DEFAULTS to `bg` and the glyph to `text`, not `bgLighter`: in light mode `bgLighter` is
 * `#ffffff`, the same white as a sheet these commonly sit on, so a `bgLighter` circle is invisible and
 * the control reads as two bare marks floating beside the fare. A host that puts the field on a `bg`
 * card passes `controlColor` to flip it — the two tokens are one step apart, and which way round they
 * go is the host's to know.
 *
 * The glyphs are `SyMinus`/`SyAdd`, which are the BARE bar and cross. `SyPlus` and `SyRemove` look like
 * the obvious pair and are not: `SyPlus` is boxed in a rounded square and `SyRemove` is set in a filled
 * circle, so pairing them puts two different shapes either side of the amount.
 */
const CONTROL_SIZE = 44

const neighbour = (steps: number[], current: number, direction: 1 | -1): number => {
	if (direction > 0) {
		return steps.find((value) => value > current) ?? current
	}
	return [...steps].reverse().find((value) => value < current) ?? current
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	disabled = false,
	currencyCode,
	stepMinor,
	steps,
	presets,
	controlColor = 'bg',
	onCommit,
	left,
	control,
	rules,
}) => {
	const [modalVisible, setModalVisible] = useState(false)

	const {
		field: { onChange, onBlur, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })

	// This field has no input and therefore no blur event, so `isTouched` would never become true and
	// `FieldHelper` would never show its error — a rider could enter an amount the field considers
	// invalid and be told nothing. Marking it touched on the first change is the honest equivalent:
	// they have interacted with it, so a refusal is now theirs to see.
	const commit = (next: number) => {
		onChange(next)
		onBlur()
	}

	// The benchmark's rule: an UNTOUCHED field is never shown as wrong, however invalid its default.
	const hasError = Boolean(error?.message) && isTouched
	const minor = typeof value === 'number' && Number.isFinite(value) ? value : 0

	// A uniform ladder is derived from `stepMinor`; an explicit `steps` list wins because a server-issued
	// band's own standard amount often does not sit on its grid, and it must still be reachable.
	const ladder = steps?.length ? steps : undefined
	const showControls = Boolean(stepMinor && stepMinor > 0) || Boolean(ladder)
	const stepTo = (direction: 1 | -1): number => {
		if (ladder) {
			return neighbour(ladder, minor, direction)
		}
		return Math.max(0, minor + direction * (stepMinor ?? 0))
	}
	const decrementTo = stepTo(-1)
	const incrementTo = stepTo(1)

	return (
		<>
			{/* `align="center"` because the INPUT is a centred money figure: a left-aligned band hint
			    under it reads as a mistake. The prop is on the shared helper, so label, hint and error
			    all follow — and every other field is untouched by its `left` default. */}
			<FieldHelper control={control} name={name} label={label} hint={hint} showError={true} align={`center`}>
				<View
					flexDirection={`row`}
					alignItems={`center`}
					justifyContent={`space-between`}
					gap={12}
					paddingHorizontal={12}>
					{left ? <React.Fragment>{left}</React.Fragment> : null}
					{showControls ? (
						<QuickAction
							testID={`field-${name}-decrement`}
							accessibilityLabel={`Decrease amount`}
							icon={`SyMinus`}
							size={CONTROL_SIZE}
							circleColor={controlColor}
							iconColor={`text`}
							disabled={disabled || decrementTo === minor}
							onPress={() => commit(decrementTo)}
						/>
					) : null}
					<Pressable
						testID={`field-${name}-trigger`}
						accessibilityRole={`button`}
						accessibilityLabel={label ?? name}
						disabled={disabled}
						onPress={disabled ? undefined : () => setModalVisible(true)}
						flex={1}
						alignItems={`center`}
						accessibilityLiveRegion={`polite`}>
						<Money
							testID={`field-${name}-value`}
							minor={minor}
							currencyCode={currencyCode}
							fontSize={36}
							lineHeight={38}
							height={38}
							marginTop={8}
							bold={true}
							fontFamily={`numerics`}
							color={hasError ? `error` : `text`}
						/>
					</Pressable>
					{showControls ? (
						<QuickAction
							testID={`field-${name}-increment`}
							accessibilityLabel={`Increase amount`}
							icon={`SyAdd`}
							size={CONTROL_SIZE}
							circleColor={controlColor}
							iconColor={`text`}
							disabled={disabled || incrementTo === minor}
							onPress={() => commit(incrementTo)}
						/>
					) : null}
				</View>
			</FieldHelper>

			<ModalAmountPad
				isVisible={modalVisible}
				// Wrapped rather than passed through, so the caller's `onCommit` fires exactly on the
				// open -> closed edge and never on an open, and always with the settled amount.
				setIsVisible={(next: boolean) => {
					setModalVisible(next)
					if (!next && modalVisible) {
						onCommit?.(minor)
					}
				}}
				value={minor}
				onChange={commit}
				currencyCode={currencyCode}
				name={name}
				{...(label ? { label } : {})}
				{...(presets ? { presets } : {})}
			/>
		</>
	)
}
