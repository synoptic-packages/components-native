import { useController, type Control } from 'react-hook-form'

import { FieldComponent as FieldHelper } from '../../field/__helpers'
import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import type { TGeneric } from '../../../types'

export type RadioCardOption = {
	value: string
	iconName: string
	title: string
	description?: string
}

export interface FieldComponentProps {
	name: string
	control: Control<TGeneric> | TGeneric
	options: RadioCardOption[]
	rules?: TGeneric
	label?: string
	hint?: string
}

export const Component = ({ name, control, options, rules, label, hint }: FieldComponentProps) => {
	const { colors, isDark } = useTheme()
	const {
		field: { value, onChange },
	} = useController({ name, control, rules })

	// Wrapped in the shared `FieldHelper` like every other field. It was the only `Field*` that rendered a bare
	// `View`, which cost it three things at once: the `field-<name>` wrapper testID the whole convention is
	// built on (so a flow could assert the individual option cards but never the field itself, and a Maestro
	// run failed on a field that was plainly on screen), the shared `label`, and consistent error presentation
	// — it was rendering its own error `Text` beside the one the helper already owns.
	return (
		<FieldHelper control={control} name={name} label={label} hint={hint} showError={true}>
			<View gap={10}>
				{options.map((option) => {
					const isSelected = value === option.value
					const iconColor = isSelected ? (isDark ? colors.accent : colors.primary) : colors.muted
					return (
						<Pressable
							key={option.value}
							testID={`field-${name}-option-${option.value}`}
							accessibilityRole={`radio`}
							accessibilityState={{ selected: isSelected }}
							accessibilityLabel={option.title}
							onPress={() => onChange(option.value)}
							style={{
								borderWidth: 1.2,
								borderColor: isSelected ? colors.primary : colors.divider,
								backgroundColor: isSelected ? `${String(colors.primary)}20` : String(colors.bgLighter),
								borderRadius: 14,
								paddingVertical: 14,
								paddingHorizontal: 14,
								flexDirection: 'row',
								alignItems: 'center',
								gap: 12,
							}}>
							<View
								flexCenter={true}
								style={{
									width: 48,
									height: 48,
									borderRadius: 24,
									backgroundColor: isSelected
										? `${String(isDark ? colors.accent : colors.primary)}20`
										: `${String(colors.muted)}20`,
								}}>
								<Icon name={option.iconName} family={`Lucide`} size={24} color={iconColor} />
							</View>
							<View flex={1}>
								<Text variant={`titleMedium`} color={`text`}>
									{option.title}
								</Text>
								{option.description ? (
									<Text
										variant={`bodySmall`}
										color={`muted`}
										marginTop={2}
										numberOfLines={2}
										ellipsizeMode={`tail`}>
										{option.description}
									</Text>
								) : null}
							</View>
							<View
								style={{
									width: 22,
									height: 22,
									borderRadius: 11,
									borderWidth: 1.5,
									borderColor: isSelected ? colors.primary : colors.muted,
									backgroundColor: isSelected ? String(colors.primary) : 'transparent',
								}}
							/>
						</Pressable>
					)
				})}
			</View>
		</FieldHelper>
	)
}
