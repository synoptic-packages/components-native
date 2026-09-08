import { Icon } from '../../icon'
import { Text } from '../../text'
import { View } from '../../view'
import { input as inputConstants } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import {
	formatDistance,
	formatDuration,
	travelSecondsEstimate,
	useDebounce,
	useGeoAutocomplete,
	type GeoResolvedDto,
	type GeoSuggestionDto,
} from '@wallet/provider'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useController, useFormState } from 'react-hook-form'
import { ActivityIndicator, TextInput as InputNative, Keyboard, Pressable } from 'react-native'
import { TextInput as TextInputNative } from 'react-native-paper'
import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { styles } from './styles'
import type { FieldComponentProps } from './types'

const placeLabel = (place: GeoResolvedDto | null | undefined): string => {
	if (!place?.address) {
		return ''
	}
	return place.address.label || place.address.formattedAddress || ''
}

export const Component: React.FC<FieldComponentProps> = ({
	name,
	label,
	hint,
	control,
	placeholder,
	disabled = false,
	rules,
	debounceMs = 300,
	accountId,
	purpose = `MOBILITY_DESTINATION`,
	outOfAreaMessage = `We do not serve that area yet.`,
}) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const componentStyles = setStylesheet(styles)
	const autocomplete = useGeoAutocomplete(purpose, accountId)
	const {
		field: { onBlur, onChange, value },
		fieldState: { error, isTouched },
	} = useController({ name, control, rules })
	const { submitCount } = useFormState({ control })
	const placeValue = value as GeoResolvedDto | null | undefined
	const currentLabel = placeLabel(placeValue)
	const [query, setQuery] = useState(currentLabel)
	const [isFocused, setIsFocused] = useState(false)
	const [isResolving, setIsResolving] = useState(false)
	// One refusal slot, two reasons: the resolve genuinely failed, or `be/` says the place is outside
	// the market. They read the same to a user but a flow must be able to tell them apart, so the
	// rendered testID is derived from the kind rather than shared.
	const [refusal, setRefusal] = useState<{ kind: 'RESOLVE_FAILED' | 'OUT_OF_AREA'; message: string } | null>(null)
	const hasError = Boolean(error?.message) && (submitCount > 0 || isTouched)
	const activeColor = hasError ? String(colors.error) : isDark ? colors?.accent : colors?.primary

	// Out-of-market rows are DROPPED, not explained. They used to render with a warning glyph and the
	// market's refusal sentence in place of the address, on the reasoning that `be/` ranks them below
	// the servable ones so the few that survive are worth explaining. The platform owner overruled it
	// (2026-08-18): "this pickup is outside areas we currently serve in search on destination and other
	// is unnecessary, just hide it serves no purpose". A row a rider cannot choose is not a result.
	//
	// The SELECTION-time refusals below stay exactly as they are: a suggestion can pass this flag and
	// still be refused at resolve, and that one the rider does need told, because it answers a tap they
	// actually made.
	const suggestions = autocomplete.suggestions.filter((suggestion) => suggestion.inServiceArea !== false)
	const isLoading = autocomplete.loading || isResolving
	// Keep the latest search callback in a ref so the debounce effect depends only on the query, not the
	// callback identity (which changes as the backend search-session ref rotates).
	const searchRef = useRef(autocomplete.search)
	searchRef.current = autocomplete.search
	const resetRef = useRef(autocomplete.reset)
	resetRef.current = autocomplete.reset

	const debouncedQuery = useDebounce(query.trim(), debounceMs)

	// The blur is deferred so a suggestion press lands before the list is torn down. The HANDLE is
	// kept because the deferral is what broke re-editing a field that already holds a value: clearing
	// or re-tapping within that window let the pending timer fire AFTER the field was focused again,
	// which turned `showList` off (the list "refuses to show") and then ran the `!isFocused` sync
	// effect, restoring the OLD label over what had just been typed (it "doesn't stick"). It read as
	// an origin-only fault because the pickup is the one field that arrives pre-filled — the
	// destination restores an empty string, which looks like nothing happening at all.
	const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
	const cancelPendingBlur = useCallback(() => {
		if (blurTimer.current) {
			clearTimeout(blurTimer.current)
			blurTimer.current = null
		}
	}, [])
	useEffect(() => cancelPendingBlur, [cancelPendingBlur])

	// The native input, so clearing can hand focus straight back. Pressing the clear glyph blurs the
	// field, and without this the rider had to tap the same field a second time before they could
	// type the replacement — the exact journey this field exists for.
	const inputRef = useRef<InputNative | null>(null)

	// Re-sync the visible text to the field's value once focus leaves — but NEVER while a selection is
	// still resolving. `handleSelect` sets the chosen text and drops focus in the same commit, so
	// without the `isResolving` guard this effect ran against the value the field held BEFORE the
	// selection and painted the previous address back over the one just tapped, until the resolve
	// returned. On a pre-filled pickup that is the whole reported symptom in miniature.
	useEffect(() => {
		if (!isFocused && !isResolving) {
			setQuery(currentLabel)
		}
	}, [currentLabel, isFocused, isResolving])

	useEffect(() => {
		if (debouncedQuery.length < 2 || debouncedQuery === currentLabel) {
			return
		}
		void searchRef.current(debouncedQuery)
	}, [debouncedQuery, currentLabel])

	const handleSelect = useCallback(
		(suggestion: GeoSuggestionDto) => {
			Keyboard.dismiss()
			cancelPendingBlur()
			setQuery(suggestion.primaryText)
			setIsFocused(false)
			// `be/` already judged this row against the market's boundary. Refuse it here rather than
			// resolving it and letting the rider carry it three screens to `mobility_quoteCreate`, which
			// is where the refusal used to arrive.
			if (suggestion.inServiceArea === false) {
				setRefusal({ kind: `OUT_OF_AREA`, message: outOfAreaMessage })
				onChange(null)
				return
			}
			setIsResolving(true)
			setRefusal(null)
			autocomplete
				.resolve(suggestion)
				.then((resolved) => {
					// The resolve is judged too: a suggestion resolves to its own point, and the ref it
					// mints is the one a quote would consume.
					if (resolved.inServiceArea === false) {
						setRefusal({ kind: `OUT_OF_AREA`, message: outOfAreaMessage })
						onChange(null)
						return
					}
					onChange(resolved)
				})
				.catch((caught) => {
					const message = caught?.message ?? String(caught)
					console.error('[field-places] geo.resolve failed:', message)
					setRefusal({ kind: `RESOLVE_FAILED`, message })
					onChange(null)
				})
				.finally(() => setIsResolving(false))
		},
		[autocomplete, cancelPendingBlur, onChange, outOfAreaMessage]
	)

	const handleClear = useCallback(() => {
		cancelPendingBlur()
		setQuery('')
		resetRef.current()
		setRefusal(null)
		onChange(null)
		setIsFocused(true)
		inputRef.current?.focus()
	}, [cancelPendingBlur, onChange])

	const showList = isFocused && (isLoading || suggestions.length > 0)

	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<View>
				<TextInputNative
					mode={`flat`}
					value={query}
					placeholder={placeholder}
					disabled={disabled}
					outlineColor={isFocused ? activeColor : String(colors.divider)}
					activeOutlineColor={activeColor}
					dense={true}
					enablesReturnKeyAutomatically
					underlineColor={isFocused ? activeColor : colors?.muted}
					activeUnderlineColor={activeColor}
					error={Boolean(error && isTouched)}
					placeholderTextColor={error && isTouched ? colors?.error : colors?.muted}
					textColor={error && isTouched ? colors?.error : colors?.text}
					autoComplete={`off`}
					underlineStyle={{ height: inputConstants.borderWidth }}
					contentStyle={[
						{
							paddingLeft: 0,
							paddingRight: 0,
							backgroundColor: `transparent`,
						},
					]}
					style={[componentStyles.input, { backgroundColor: `transparent`, paddingLeft: 0, paddingRight: 0 }]}
					render={(inputProps) => (
						<View style={componentStyles.inputContent}>
							<InputNative
								{...inputProps}
								ref={inputRef}
								value={query}
								onBlur={(event) => {
									inputProps.onBlur?.(event)
									onBlur()
									cancelPendingBlur()
									blurTimer.current = setTimeout(() => setIsFocused(false), 200)
								}}
								onFocus={(event) => {
									inputProps.onFocus?.(event)
									// Re-focusing CANCELS the pending blur. Without this the previous
									// blur's timer still fires 200ms later and closes a list the rider
									// is actively looking at.
									cancelPendingBlur()
									setIsFocused(true)
								}}
								onChangeText={(text) => {
									setQuery(text)
									if (!text) {
										onChange(null)
										resetRef.current()
									}
								}}
								placeholder={placeholder}
								returnKeyType={`search`}
								autoCorrect={false}
								editable={!disabled}
								autoComplete={`off`}
								testID={`field-${name}-input`}
								style={[
									inputProps.style,
									componentStyles.nativeInput,
									{ color: error && isTouched ? colors?.error : colors?.text },
								]}
							/>
							{query ? (
								<Icon
									// Selectable. The clear existed but carried no id, so no flow could reach it
									// and "clearing a destination" was untested on every surface that uses this
									// field. Derived from `name`, like every other id in the field contract.
									testID={`field-${name}-clear`}
									accessibilityLabel={`Clear`}
									family={`Lucide`}
									name={`X`}
									size={20}
									color={error && isTouched ? colors?.error : colors?.muted}
									onPress={handleClear}
									backgroundStyle={componentStyles.rightIconButton}
								/>
							) : null}
						</View>
					)}
				/>
				{refusal ? (
					<Text
						color={`error`}
						fontSize={12}
						marginTop={4}
						testID={
							refusal.kind === `OUT_OF_AREA` ? `field-${name}-out-of-area` : `field-${name}-resolve-error`
						}>
						{refusal.message}
					</Text>
				) : null}
				{showList ? (
					<View style={componentStyles.suggestionsList}>
						{isLoading && suggestions.length === 0 ? (
							<View style={componentStyles.suggestionRow}>
								<ActivityIndicator color={String(colors.muted)} size={`small`} />
							</View>
						) : null}
						{/* Every row here is servable — the out-of-market ones are filtered out above, so
						    there is no refused state to draw. */}
						{suggestions.map((suggestion, index) => {
							return (
								<Pressable
									key={suggestion.placeRef || `${suggestion.primaryText}-${index}`}
									onPress={() => handleSelect(suggestion)}
									testID={`field-${name}-suggestion-${index}`}
									style={[
										componentStyles.suggestionRow,
										index < suggestions.length - 1 ? componentStyles.suggestionDivider : null,
									]}>
									{/* Synotech first, per the shared icon boundary's house set. 20pt rather
									    than 16: the Sy glyphs are drawn lighter than Lucide's strokes and
									    read thin beside a 15pt title at the smaller size. */}
									<Icon
										family={`Synotech`}
										name={`SyLocation`}
										size={20}
										color={colors.muted}
										style={componentStyles.placeIcon}
									/>
									<View flex={1}>
										<Text variant={`labelMedium`} numberOfLines={1}>
											{suggestion.primaryText}
										</Text>
										{suggestion.secondaryText ? (
											<Text color={`muted`} fontSize={12} marginTop={2} numberOfLines={1}>
												{suggestion.secondaryText}
											</Text>
										) : null}
									</View>
									{/* The trailing meta the browser's rows carry, so the two lists read alike.
									    `be/` supplies the distance; the TIME is a local estimate from it
									    (`travelSecondsEstimate`) because a suggestion has no routed duration —
									    nothing has been quoted yet. It is deliberately the cruder of the two
									    figures and is never shown where a server duration exists. */}
									{suggestion.distanceMeters ? (
										<View alignItems={`flex-end`}>
											<Text color={`muted`} fontSize={12}>
												{formatDistance(suggestion.distanceMeters)}
											</Text>
											<Text color={`muted`} fontSize={11}>
												{formatDuration(travelSecondsEstimate(suggestion.distanceMeters))}
											</Text>
										</View>
									) : null}
								</Pressable>
							)
						})}
					</View>
				) : null}
			</View>
		</FieldHelper>
	)
}
