import { FieldPlaces } from '../../field-places'
import { Icon } from '../../icon'
import { Pressable } from '../../pressable'
import { Text } from '../../text'
import { View } from '../../view'
import React, { useCallback, useMemo } from 'react'
import { useController } from 'react-hook-form'
import type { FieldRouteProps, FieldRoutePlace } from './types'

export const Component: React.FC<FieldRouteProps> = ({
	name,
	control,
	accountId,
	originLabel,
	destinationLabel,
	originPlaceholder,
	destinationPlaceholder,
	stopPlaceholder,
	addStopLabel = `Add stop`,
	outOfAreaMessage,
	allowStops = false,
	maxStops = 2,
	allowSwap = true,
	disabled = false,
	rules,
}) => {
	const originName = `${name}.origin`
	const destinationName = `${name}.destination`
	const stopsName = `${name}.stops`

	const origin = useController({ name: originName, control })
	const destination = useController({ name: destinationName, control })
	const stops = useController({ name: stopsName, control, defaultValue: [] })

	const stopValues: (FieldRoutePlace | null)[] = useMemo(
		() => (Array.isArray(stops.field.value) ? stops.field.value : []),
		[stops.field.value]
	)

	const swap = useCallback(() => {
		const nextOrigin = destination.field.value ?? null
		const nextDestination = origin.field.value ?? null
		origin.field.onChange(nextOrigin)
		destination.field.onChange(nextDestination)
	}, [origin.field, destination.field])

	const addStop = useCallback(() => {
		if (stopValues.length >= maxStops) {
			return
		}
		stops.field.onChange([...stopValues, null])
	}, [stops.field, stopValues, maxStops])

	const removeStop = useCallback(
		(index: number) => {
			stops.field.onChange(stopValues.filter((_, current) => current !== index))
		},
		[stops.field, stopValues]
	)

	const canAddStop = allowStops && stopValues.length < maxStops

	return (
		<View testID={`field-${name}`} gap={4}>
			<View flexDirection={`row`} gap={10}>
				<View width={16} alignItems={`center`} paddingTop={18}>
					<View width={12} height={12} borderRadius={6} borderWidth={2} borderColor={`primary`} />
					<View
						width={2}
						flex={1}
						minHeight={16}
						backgroundColor={`divider`}
						marginVertical={4}
						borderRadius={1}
					/>
					{stopValues.map((_, index) => (
						<React.Fragment key={`field-${name}-rail-stop-${index}`}>
							<View width={10} height={10} borderRadius={5} borderWidth={2} borderColor={`muted`} />
							<View
								width={2}
								flex={1}
								minHeight={16}
								backgroundColor={`divider`}
								marginVertical={4}
								borderRadius={1}
							/>
						</React.Fragment>
					))}
					<Icon family={`Lucide`} name={`MapPin`} size={16} color={`primary`} />
				</View>

				<View flex={1} gap={8}>
					<FieldPlaces
						name={originName}
						control={control}
						accountId={accountId}
						purpose={`MOBILITY_ORIGIN`}
						label={originLabel}
						placeholder={originPlaceholder}
						outOfAreaMessage={outOfAreaMessage}
						disabled={disabled}
						rules={rules}
					/>

					{stopValues.map((_, index) => (
						<View key={`field-${name}-stop-${index}`} flexDirection={`row`} alignItems={`center`} gap={8}>
							<View flex={1}>
								<FieldPlaces
									name={`${stopsName}.${index}`}
									control={control}
									accountId={accountId}
									purpose={`MOBILITY_DESTINATION`}
									placeholder={stopPlaceholder ?? `Add a stop`}
									outOfAreaMessage={outOfAreaMessage}
									disabled={disabled}
								/>
							</View>
							<Icon
								family={`Lucide`}
								name={`X`}
								size={18}
								color={`muted`}
								disabled={disabled}
								onPress={() => removeStop(index)}
								testID={`field-${name}-stop-${index}-remove`}
							/>
						</View>
					))}

					<FieldPlaces
						name={destinationName}
						control={control}
						accountId={accountId}
						purpose={`MOBILITY_DESTINATION`}
						label={destinationLabel}
						placeholder={destinationPlaceholder}
						outOfAreaMessage={outOfAreaMessage}
						disabled={disabled}
						rules={rules}
					/>
				</View>

				{allowSwap ? (
					<View justifyContent={`center`}>
						<Icon
							family={`Lucide`}
							name={`ArrowUpDown`}
							size={18}
							color={`muted`}
							disabled={disabled}
							onPress={swap}
							testID={`field-${name}-swap`}
						/>
					</View>
				) : null}
			</View>

			{canAddStop ? (
				<Pressable
					flexDirection={`row`}
					alignItems={`center`}
					gap={6}
					paddingVertical={6}
					disabled={disabled}
					onPress={addStop}
					testID={`field-${name}-add-stop`}>
					<Icon family={`Lucide`} name={`Plus`} size={16} color={`primary`} />
					<Text variant={`labelMedium`} color={`primary`}>
						{addStopLabel}
					</Text>
				</Pressable>
			) : null}
		</View>
	)
}

export default Component
