import { useCallback, useEffect, useState } from 'react'

import countriesData from '../constants/countries.json'
import { upperCase } from '../lib/string'
import type { TGeneric } from '../types'

export interface Country {
	countryCode: string
	name: { common: string; [key: string]: string }
	callingCode?: string
	states?: string[]
	[key: string]: TGeneric
}

export interface UseCountryReturn {
	countries: Country[]
	getCountryByCode: (_code?: string | null) => Country | undefined
	options: Array<{ label: string; value: string; callingCode?: string; countryCode: string }>
}

/**
 * Country list + lookup, backed by the packaged countries dataset.
 *
 * Ported from the wallet provider for package self-containment: same option
 * shape (`label`/`value`/`callingCode`/`countryCode`), same case-insensitive
 * `getCountryByCode` against the FULL list (a stored value still resolves
 * when the offered options are restricted).
 */
export function useCountry(dataList: Country[] = countriesData as Country[], restrictTo?: string[]): UseCountryReturn {
	const [countries, setCountries] = useState<Country[]>(dataList)
	const [options, setOptions] = useState<UseCountryReturn['options']>([])
	const restrictKey = (restrictTo ?? []).map((code) => upperCase(code)).sort().join(',')

	useEffect(() => {
		const allow = restrictKey ? restrictKey.split(',') : []
		const source = allow.length
			? dataList.filter((country) => allow.includes(upperCase(country.countryCode)))
			: dataList
		setCountries(source)
		setOptions(
			source.map((country) => ({
				label: country.name.common,
				value: country.countryCode,
				callingCode: country.callingCode,
				countryCode: country.countryCode,
			}))
		)
	}, [dataList, restrictKey])

	const getCountryByCode = useCallback(
		(code?: string | null) => {
			return dataList.find((country) => upperCase(country?.countryCode) === upperCase(code ?? ''))
		},
		[dataList]
	)

	return { countries, getCountryByCode, options }
}
