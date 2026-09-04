import { ErrorBoundary } from '../../error-boundary/index'
import { Text } from '../../text/index'
import { useTheme } from '../../../hooks/useTheme'
import GorhomBottomSheet, { type BottomSheetProps } from '@gorhom/bottom-sheet'
import { forwardRef, useCallback, type ComponentRef } from 'react'
import type { ColorName } from '../../../constants/index'
import { StyleSheet, View } from 'react-native'
import { styles } from './styles'

export type { BottomSheetProps }

/** Semantic fills light enough to need dark text on them. Mirrors `Alert`'s own rule. */
const LIGHT_FILLS = new Set<ColorName>(['warning', 'accent'])

export interface SharedBottomSheetProps extends BottomSheetProps {
	/**
	 * Identifies the sheet itself in the native view tree.
	 *
	 * This has to be rendered here rather than handed to gorhom, because `BottomSheetProps` does not
	 * extend `ViewProps` and carries no `testID` — an unknown prop spread into it is dropped without a
	 * warning. This wrapper used to declare `BottomSheetProps & { testID?: string }` and spread it
	 * straight through, so every `testID` a caller set on a sheet silently reached nothing: the sheet's
	 * CHILDREN were selectable (they carry their own ids) but the sheet was not, which reads in a test
	 * run as "Maestro cannot see the bottom sheet" and is really a five-line component defect.
	 */
	testID?: string
	/**
	 * A standing message for the sheet, drawn as a coloured TONGUE tucked behind the sheet's top edge.
	 *
	 * Placement is the whole point. A message in the body scrolls away exactly when it still applies and
	 * competes with the content for the reader's first fixation; pinned here it is the first thing read
	 * and the last thing lost, and it travels with the sheet when the sheet is dragged. The sheet's own
	 * surface is redrawn over the tongue's lower half so the card appears to sit in front of its label.
	 *
	 * Universal: any sheet in the app gets it by passing these two props. `alertColor` is a semantic
	 * token, so the tongue is always on the active tenant's palette.
	 */
	alert?: string
	/** The tongue's surface. Defaults to `accent` — the tenant's own tone. */
	alertColor?: ColorName
	/** Identifies the tongue in the native view tree, so a flow can assert the message is shown. */
	alertTestID?: string
}

const Native = forwardRef<ComponentRef<typeof GorhomBottomSheet>, SharedBottomSheetProps>(
	function BottomSheet(props, ref) {
		const { colors, setStylesheet } = useTheme()
		const {
			backgroundStyle,
			handleIndicatorStyle,
			handleComponent,
			testID,
			alert,
			alertColor = 'accent',
			alertTestID,
			...rest
		} = props
		// The sheet's own surface, so the block redrawn over the tongue matches it exactly. Reading it
		// from `backgroundStyle` keeps a caller's override (a grey sheet, say) working without a second
		// prop that could disagree with it.
		const sheetSurface =
			(StyleSheet.flatten(backgroundStyle) as { backgroundColor?: string } | undefined)?.backgroundColor ??
			String(colors.bgLighter)

		// The grab indicator has to be redrawn here, because taking over `handleComponent` is what puts
		// the banner above it — gorhom renders nothing else in that region.
		const componentStyles = setStylesheet(styles)
		const handleWithAlert = useCallback(
			() => (
				<View
					testID={alertTestID}
					style={[componentStyles.tongue, { backgroundColor: String(colors[alertColor]) }]}>
					{/* The tongue owns its own typography and contrast because it owns the surface —
					    otherwise every caller re-derives which fill needs dark text, and one of them
					    eventually gets it wrong. `warning` and `accent` are light fills; the rest are not. */}
					<Text
						variant={`bodySmall`}
						align={`center`}
						color={LIGHT_FILLS.has(alertColor) ? `black` : `white`}
						numberOfLines={2}
						style={componentStyles.tongueLabel}>
						{alert}
					</Text>
					<View style={[componentStyles.surface, { backgroundColor: sheetSurface }]}>
						<View style={componentStyles.indicator} />
					</View>
				</View>
			),
			[alert, alertColor, alertTestID, colors, componentStyles, sheetSurface]
		)

		const sheet = (
			<GorhomBottomSheet
				ref={ref}
				accessible={false}
				backgroundStyle={[
					{
						backgroundColor: colors.bgLighter,
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: -4 },
						shadowOpacity: 0.1,
						shadowRadius: 12,
						elevation: 16,
					},
					backgroundStyle,
				]}
				handleIndicatorStyle={[{ backgroundColor: colors.divider, width: 42 }, handleIndicatorStyle]}
				handleComponent={alert ? handleWithAlert : handleComponent}
				{...rest}
			/>
		)

		if (!testID) {
			return sheet
		}

		// `absoluteFill` + `box-none` keeps the geometry identical: the wrapper matches the parent the
		// sheet already measured itself against, so percentage snap points are unchanged, and taps on
		// the map behind the sheet still land on the map.
		return (
			<View testID={testID} style={StyleSheet.absoluteFill} pointerEvents={`box-none`}>
				{sheet}
			</View>
		)
	}
)

export const Component = forwardRef<ComponentRef<typeof GorhomBottomSheet>, SharedBottomSheetProps>(
	function BottomSheetWithBoundary(props, ref) {
		return (
			<ErrorBoundary>
				<Native ref={ref} {...props} />
			</ErrorBoundary>
		)
	}
)
