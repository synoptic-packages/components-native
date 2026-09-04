import { Component as ChartLine, type ComponentProps as ChartLineProps } from './Component'

/**
 * The same line, sized for a row.
 *
 * A sparkline sits beside a value in a list, so it is short, it draws only the recent tail, and it has
 * no room for an explanation — an undrawable series renders nothing rather than pushing a sentence into
 * a row built for a number. It is a variant of `ChartLine`, not a second chart: one treatment, one set
 * of series rules, two sizes.
 *
 * **The fill is OFF by default, and that is the size doing the deciding.** A gradient that reads as a
 * soft wash at 96pt is a solid block at 28, and a dark asset colour makes it a black rectangle beside
 * the price — which is what it did on the Krugergold rows before this default flipped. A bare line is
 * also what the platform owner drew. Pass `area` where a filled sparkline genuinely reads better.
 */
export const CHART_SPARKLINE_POINTS = 7

export interface ComponentProps extends Omit<ChartLineProps, 'emptyLabel'> {}

export const Component = ({ height = 36, limit = CHART_SPARKLINE_POINTS, area = false, ...rest }: ComponentProps) => (
	<ChartLine height={height} limit={limit} area={area} {...rest} />
)
