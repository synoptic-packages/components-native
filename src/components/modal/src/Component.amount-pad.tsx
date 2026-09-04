import { Icon } from '../../icon'
import { Money } from '../../money'
import { Pressable } from '../../pressable'
import { Text } from '../../text'
import { SafeAreaView, View } from '../../view'
import { useTheme } from '../../../hooks/useTheme'
import { amountPadBackspace, amountPadClear, amountPadDigit } from '../../../lib/currency'
import React from 'react'
import { deviceWidth } from '../../../constants'
import { Component as Modal } from './Component'
import { styles } from './styles.amount-pad'

/**
 * The editing surface of `FieldAmountPad` — a numeric keypad in a bottom modal.
 *
 * It lives here rather than inside `field-amount-pad/` for the same reason `ModalFormField` does: modal
 * variants live with the modal, and building on the shared `Modal` primitive inherits the app's
 * established modal behaviour (backdrop, animation, hardware back) for free.
 *
 * **It holds no VALUE.** Every keystroke calls `onChange` with the next amount, so the inline figure
 * behind the modal moves as the rider types and there is nothing to reconcile on dismiss — there is one
 * value, owned by the field's `useController`, and both presentations write it. The only state here is
 * a flag saying whether this session of the pad has started a new amount yet (see `typing` below).
 *
 * It also does not clamp. A per-keystroke clamp makes an amount unreachable: typing `6` on the way to
 * `65.00` is below any sane floor and would snap on the first digit, after which no further digit can
 * recover it. An out-of-range amount is therefore ENTERABLE and surfaces through the shared field error,
 * which is the same way every other `Field*` refuses a value. The inline `−`/`+` controls, which walk a
 * fixed grid, cannot leave the range and are what pull a typed value back into it.
 */

const KEY_ROWS = [
	['1', '2', '3'],
	['4', '5', '6'],
	['7', '8', '9'],
] as const

/** One gutter and one gap for the whole pad, so the header, the presets and the grid share an edge. */
const PAD_GUTTER = 20
const PAD_GAP = 10
const PAD_KEY_HEIGHT = 58

interface Props {
	isVisible: boolean
	setIsVisible: (visible: boolean) => void
	/** Minor units. The single source of truth, owned by the field's `useController`. */
	value: number
	onChange: (minor: number) => void
	currencyCode: string
	/** Derives every key's `testID` (`field-<name>-key-7`), as `FieldSelect` derives its trigger's. */
	name: string
	label?: string
	/** Minor values offered as one-tap chips — e.g. the band's standard fare and a step or two above it. */
	presets?: number[]
}

export const Component: React.FC<Props> = ({
	isVisible,
	setIsVisible,
	value,
	onChange,
	currencyCode,
	name,
	label,
	presets = [],
}) => {
	const { setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)

	// Whether the rider has started a NEW amount in this session of the pad. The first keystroke
	// replaces what was there rather than appending to it — opening a pad showing R777.14 and typing
	// `2` must mean R0.02, not R7,771.42. Every amount keypad behaves this way and the alternative is
	// unusable on a prefilled field.
	//
	// It is a flag, not a second value: the amount itself remains the one `useController` value that
	// both presentations write, which is why there is still nothing to synchronise.
	const [typing, setTyping] = React.useState(false)
	React.useEffect(() => {
		if (isVisible) setTyping(false)
	}, [isVisible])

	const digit = (pressed: number) => {
		onChange(amountPadDigit(typing ? value : 0, pressed))
		setTyping(true)
	}
	const backspace = () => {
		onChange(amountPadBackspace(typing ? value : 0))
		setTyping(true)
	}
	const clear = () => {
		onChange(amountPadClear())
		setTyping(true)
	}
	const preset = (minor: number) => {
		onChange(minor)
		// A preset is a complete amount, so a digit after it should extend it rather than restart.
		setTyping(true)
	}

	return (
		<Modal isVisible={isVisible} setIsVisible={setIsVisible} onBackdropPress={() => setIsVisible(false)}>
			<View flex={1} justifyContent={`flex-end`}>
				<SafeAreaView style={componentStyles.surface}>
					{/* The id lives on the CONTENT, not on `Modal`. `react-native-modal` accepts a `testID`
					    and does not forward it to anything in the native view tree, so an acceptance test
					    could not select the pad at all while it was sitting there — the same lesson as an
					    id on a pressable icon belonging to the pressable and not the glyph. */}
					<View
						testID={`field-${name}-modal`}
						width={deviceWidth}
						paddingHorizontal={PAD_GUTTER}
						paddingTop={16}
						paddingBottom={20}
						gap={14}>
						{/* The header sits on the SAME gutter as the key grid, so the label's left edge lines
						    up with the `1` key's and the done control's right edge with the backspace's.
						    Anything else reads as a mis-set page however carefully the grid inside is built. */}
						<View flexDirection={`row`} alignItems={`center`} justifyContent={`space-between`}>
							<Text fontSize={13} color={`muted`} bold={true}>
								{label}
							</Text>
							{/* A filled circle, not a bare glyph. It is the only way out of a modal that
							    covers the fare it is editing, and at 20pt of unbacked ink in a corner it read
							    as decoration — a control that important has to look like one. Same circle
							    geometry as the −/+ pair behind it, so the pad's controls are one family. */}
							<Pressable
								testID={`field-${name}-done`}
								accessibilityRole={`button`}
								accessibilityLabel={`Done`}
								onPress={() => setIsVisible(false)}
								width={40}
								height={40}
								borderRadius={20}
								alignItems={`center`}
								justifyContent={`center`}
								backgroundColor={`primary`}>
								<Icon family={`Synotech`} name={`SyCheck`} size={24} color={`white`} />
							</Pressable>
						</View>

						{/* A live region because there is no native input to announce itself: a screen reader
						    must still hear the amount change on every keystroke. */}
						<View alignItems={`center`} accessibilityLiveRegion={`polite`}>
							<Money
								testID={`field-${name}-modal-value`}
								minor={value}
								currencyCode={currencyCode}
								fontSize={40}
							/>
						</View>

						{/* The presets share the KEY GRID's columns — same gutter, same gap, equal cells —
						    rather than floating as a centred cluster. Two rows of tappable things stacked on
						    each other are read as one object, and an object whose halves sit on different
						    rhythms looks unresolved however well each half is spaced. */}
						{presets.length ? (
							<View flexDirection={`row`} gap={PAD_GAP}>
								{presets.map((chip) => (
									<Pressable
										key={chip}
										testID={`field-${name}-preset-${chip}`}
										accessibilityRole={`button`}
										onPress={() => preset(chip)}
										flex={1}
										height={40}
										alignItems={`center`}
										justifyContent={`center`}
										borderRadius={20}
										backgroundColor={`bgLighter`}>
										<Money minor={chip} currencyCode={currencyCode} fontSize={14} />
									</Pressable>
								))}
							</View>
						) : null}

						{/* The grid is laid out in explicit rows and must NOT mirror under RTL — a mirrored
						    numeric pad is a usability bug, not a localization feature. Rows are ordered
						    here rather than by writing direction, so nothing flips. */}
						<View gap={PAD_GAP}>
							{KEY_ROWS.map((row) => (
								<View key={row.join()} flexDirection={`row`} gap={PAD_GAP}>
									{row.map((key) => (
										<PadKey key={key} name={name} digit={key} onPress={() => digit(Number(key))} />
									))}
								</View>
							))}
							<View flexDirection={`row`} gap={PAD_GAP}>
								{/* An empty cell keeps `0` centred under `8` without inventing a fourth column. */}
								<View flex={1} />
								<PadKey name={name} digit={`0`} onPress={() => digit(0)} />
								<Pressable
									testID={`field-${name}-key-backspace`}
									accessibilityRole={`button`}
									accessibilityLabel={`Delete last digit`}
									onPress={() => backspace()}
									onLongPress={() => clear()}
									flex={1}
									height={PAD_KEY_HEIGHT}
									borderRadius={14}
									alignItems={`center`}
									justifyContent={`center`}
									backgroundColor={`bgLighter`}>
									<Icon family={`Lucide`} name={`Delete`} size={22} color={`text`} />
								</Pressable>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</View>
		</Modal>
	)
}

const PadKey: React.FC<{ name: string; digit: string; onPress: () => void }> = ({ name, digit, onPress }) => (
	<Pressable
		testID={`field-${name}-key-${digit}`}
		accessibilityRole={`button`}
		accessibilityLabel={digit}
		onPress={onPress}
		flex={1}
		height={PAD_KEY_HEIGHT}
		borderRadius={14}
		alignItems={`center`}
		justifyContent={`center`}
		backgroundColor={`bgLighter`}>
		{/* `numerics` — the same face every price and figure in the app is set in, including the amount
		    directly above these keys. A keypad set in the UI face beside an amount set in the numeric one
		    reads as two different products stacked on each other. */}
		<Text fontFamily={`numerics`} fontSize={24} color={`text`}>
			{digit}
		</Text>
	</Pressable>
)
