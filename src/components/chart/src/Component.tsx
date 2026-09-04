import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import type { ColorName } from '../../../theme/colors'
import { LineChart } from 'react-native-gifted-charts'

import { chartLineColor } from './color'
import { chartHasLine, chartPoints, type ChartSeriesOrder } from './series'

/**
 * One value over time, as a line.
 *
 * **The treatment is fixed on purpose.** `react-native-gifted-charts`' `LineChart`, `curved`, no axes,
 * no rules, no data points, a 2pt line and a gradient fading 0.36 → 0.02 — carried over from the
 * Krugergold price line, which is where it was proven. Every chart in the app reads as the same
 * instrument because the only things a caller chooses are the series, the colour and the height. A
 * caller that needs a different treatment has found a gap to raise, not a prop to add.
 *
 * **An undrawable series says so rather than drawing something.** Below `CHART_MINIMUM_POINTS` there is
 * no honest line to draw, so the chart renders `emptyLabel` — or nothing, when the caller has no room
 * for a sentence. A chart is a claim about what a value did; a flat line invented from one sample is
 * read as "it did not move", which is a different and false claim.
 *
 * **`order` is not optional thinking.** A backend history query is normally descending, and drawing it
 * unreversed renders every movement backwards. See `series.ts`.
 */
export interface ComponentProps {
	/** The raw series. Strings and nulls are tolerated — a backend integer column often arrives as one. */
	values: readonly unknown[]
	/** Which end of `values` is the most recent sample. Defaults to `oldest-first`. */
	order?: ChartSeriesOrder
	/** Draw at most this many of the most recent points. */
	limit?: number
	/** A semantic token name, or a colour the backing record supplied. Falls back to `primary`. */
	color?: ColorName | string
	height?: number
	/**
	 * Drawn width. Omit and the line sizes itself to its parent, which is right for a card or a row.
	 * Pass it for a chart that BLEEDS past its container — a full-width hero behind a balance sizes to
	 * the screen, not to the padded column it is nested in.
	 */
	width?: number
	/** Fill under the line. On by default; turn it off for a bare line. */
	area?: boolean
	/** Shown in place of the line when the series cannot honestly be drawn. Omit to render nothing. */
	emptyLabel?: string
	testID?: string
}

export const Component = ({
	values,
	order,
	limit,
	color,
	height = 96,
	width,
	area = true,
	emptyLabel,
	testID,
}: ComponentProps) => {
	const { colors } = useTheme()

	const points = chartPoints(values, { order, limit })
	const line = chartLineColor(color, colors)

	if (!chartHasLine(points)) {
		if (!emptyLabel) return null

		return (
			<View testID={testID ? `${testID}-empty` : undefined} height={height} justifyContent={`center`}>
				<Text color={`muted`} size={11} textAlign={`center`}>
					{emptyLabel}
				</Text>
			</View>
		)
	}

	return (
		<View testID={testID} height={height} justifyContent={`center`}>
			<LineChart
				curved
				areaChart={area}
				adjustToWidth
				disableScroll
				data={points}
				initialSpacing={0}
				endSpacing={0}
				height={height}
				{...(width === undefined ? {} : { width })}
				thickness={2}
				hideAxesAndRules
				hideDataPoints
				yAxisLabelWidth={0}
				color={line}
				startFillColor={line}
				endFillColor={line}
				startOpacity={area ? 0.36 : 0}
				endOpacity={area ? 0.02 : 0}
				backgroundColor={`transparent`}
				yAxisColor={`transparent`}
				xAxisColor={`transparent`}
				rulesColor={`transparent`}
			/>
		</View>
	)
}
