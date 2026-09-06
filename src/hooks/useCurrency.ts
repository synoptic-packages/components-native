import { useMemo } from 'react'

import currenciesData from '../constants/currencies.json'
import type { TGeneric } from '../types'

export interface Currency {
	code: string
	symbol?: string
	name: { common: string; [key: string]: string }
	flag?: string
	order?: number
	[key: string]: TGeneric
}

export interface UseCurrencyReturn {
	currencyGet: (_code?: string | null) => Currency | undefined
	options: Array<{ value: string; label: string; countryCode?: string }>
}

/**
 * Currency catalogue + lookup, backed by the packaged currencies dataset.
 *
 * Ported from the wallet provider for package self-containment: same option
 * shape (`value`/`label`/`countryCode`) and the same code-exact
 * `currencyGet` lookup. Hosts with a narrower catalogue filter `options`
 * themselves (or pass a custom `data` list).
 */
export function useCurrency(data: Currency[] = currenciesData as Currency[]): UseCurrencyReturn {
	const currencyGet = (code?: string | null): Currency | undefined => {
		return data?.find((currency) => currency.code === code)
	}

	const options = useMemo(
		() =>
			data.map((currency) => ({
				value: currency.code,
				label: currency.name.common,
				countryCode: currency.flag,
			})),
		[data]
	)

	return { currencyGet, options }
}
