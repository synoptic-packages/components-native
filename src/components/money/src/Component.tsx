import { currencyDisplay, currencyMask, currencyMinorUnits, minorToMajor } from '../../../lib/currency'
import React from 'react'

import { Text } from '../../text/index'

type TextProps = React.ComponentProps<typeof Text>

export interface ComponentProps extends Omit<TextProps, 'children'> {
	/** A MAJOR figure, already converted. Prefer `minor` — see below. */
	value?: number | string | null | undefined
	/**
	 * The server's own `*Minor` integer, converted here using the currency's real ISO 4217 exponent.
	 *
	 * This exists because every call site was doing `value={x.minor / 100}` by hand — thirty of them in a
	 * single product tree. That divisor is only right for the 129 two-decimal currencies: a UGX or RWF
	 * amount is stored with exponent 0, so `/ 100` renders one hundredth of what the user actually owes,
	 * and a KWD amount is thousandths, so it renders ten times too much. Both are markets adjacent to
	 * ones this product opens into.
	 *
	 * Fixing it here rather than at each call site is the point: a literal is not a typed call site, so
	 * nothing would ever have gone red, and the next screen someone writes would have copied the divisor
	 * from the one beside it.
	 */
	minor?: number | null | undefined
	currencyCode?: string
	unlabelled?: boolean
}

export const Component: React.FC<ComponentProps> = ({
	value,
	minor,
	currencyCode,
	unlabelled,
	fontFamily,
	...rest
}) => {
	const amount = minor === undefined || minor === null ? (value ?? 0) : minorToMajor(minor, currencyCode)
	const text =
		unlabelled || !currencyCode
			? currencyMask(amount, currencyMinorUnits(currencyCode))
			: currencyDisplay(amount, currencyCode)
	return (
		<Text fontFamily={fontFamily ?? `numerics`} {...rest}>
			{text}
		</Text>
	)
}
