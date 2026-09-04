/**
 * The series model behind `ChartLine` and `ChartSparkline` — everything about a plotted line that is a
 * decision rather than a rendering, kept in a pure `.ts` beside the component so `tests/chart-series.test.mjs`
 * can exercise it without a native runner. The same arrangement `places-rows.ts` and `trip-stage.ts` use.
 *
 * ORDER IS DECLARED, NEVER ASSUMED. A backend history query is normally descending — `assets_history`
 * is — and drawing it unreversed renders every movement backwards: a rising asset falls. Nothing in the
 * type system, at runtime, or in a screenshot review catches that unless the reader already knows which
 * way the value went, so the direction of the incoming array is a property the caller states.
 *
 * A LINE MAKES A CLAIM. Two points is the least that can honestly be called one; one point is a dot and
 * none is nothing. Rather than draw a flat line a viewer would read as "it did not move", a series below
 * the minimum is reported as having no line so the surface can say so instead.
 */

/** One plotted point, in the shape `react-native-gifted-charts` consumes. */
export interface ChartPoint {
	value: number
}

/** Which end of the incoming array is the most recent sample. */
export type ChartSeriesOrder = 'oldest-first' | 'newest-first'

export interface ChartSeriesOptions {
	/** Defaults to `oldest-first`, so an undeclared order never silently reverses a series. */
	order?: ChartSeriesOrder
	/** Keep at most this many of the most recent points. Ignored when not positive. */
	limit?: number
}

/** Two points is the minimum that can honestly be called a line. One is a dot; none is nothing. */
export const CHART_MINIMUM_POINTS = 2

/**
 * A backend integer column commonly arrives as a string (`priceMinor`), and an absent sample as `null`.
 * Anything that does not resolve to a finite number is dropped rather than plotted as zero — a zero is a
 * price, and inventing one is the same class of defect as inventing the whole series.
 */
const plottable = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null

	const numeric = Number(value)

	return Number.isFinite(numeric) ? numeric : null
}

/**
 * Normalise a raw series into drawable points, oldest → newest.
 *
 * The limit is applied AFTER unplottable values are dropped, so it is a count of points that will be
 * drawn rather than of rows that were fetched.
 */
export const chartPoints = (values: readonly unknown[], options: ChartSeriesOptions = {}): ChartPoint[] => {
	const { order = `oldest-first`, limit } = options

	const ordered = order === `newest-first` ? [...values].reverse() : values

	const points = ordered.reduce<ChartPoint[]>((accumulated, value) => {
		const numeric = plottable(value)

		if (numeric !== null) accumulated.push({ value: numeric })

		return accumulated
	}, [])

	return limit && limit > 0 ? points.slice(-limit) : points
}

/** Whether the series has enough points to draw a line rather than an empty state. */
export const chartHasLine = (points: readonly ChartPoint[]) => points.length >= CHART_MINIMUM_POINTS

/**
 * The drawn extent, for a caller that labels the line's high and low. `null` when there is nothing
 * drawn — a caller must not fall back to `0`, which would label an axis the chart never had.
 */
export const chartValueRange = (points: readonly ChartPoint[]): { min: number; max: number } | null => {
	if (points.length === 0) return null

	return points.reduce(
		(range, point) => ({
			min: Math.min(range.min, point.value),
			max: Math.max(range.max, point.value),
		}),
		{ min: points[0].value, max: points[0].value }
	)
}
