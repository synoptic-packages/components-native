import { Pressable } from '../../pressable/index'
import type { TGeneric } from '../../../types'
import elevation from '../../../utils/elevation'
import React, { ReactElement, ReactNode } from 'react'
import { DimensionValue, StyleSheet } from 'react-native'
import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { Text } from '../../text'
import { View } from '../../view'
import { styles } from './styles'

interface Option {
	label: string
	value: string
	left?: ReactNode
}

export type ComponentProps = {
	options: Option[]
	color?: ColorName
	selected: number
	setSelected: TGeneric
	width?: DimensionValue
	onChange?: TGeneric
	/**
	 * Drop the container surface, border and per-segment fill, leaving the labels alone with the
	 * selected one in `text` and the rest in `muted`.
	 *
	 * It exists for a control that sits ON something rather than in a form — the Krugergold balance's
	 * D/W/M/Y over a full-bleed graph, where the boxed treatment reads as a field floating on the
	 * artwork. It is a variant rather than a second control precisely so the two cannot drift: the
	 * options, selection and press behaviour are the same code either way.
	 */
	plain?: boolean
}

export const Component: React.FC<ComponentProps> = ({
	options,
	selected,
	setSelected,
	onChange,
	color,
	width = '100%',
	plain,
}) => {
	const { colors } = useTheme()

	return (
		<View
			style={[
				styles.container,
				plain ? styles.containerPlain : null,
				{
					backgroundColor: plain ? `transparent` : colors.bgLighter,
					width,
					borderWidth: plain ? 0 : StyleSheet.hairlineWidth,
					borderColor: colors.divider,
				},
			]}>
			{options.map((segment, i) => {
				const isSelected = selected === i
				const textColor = isSelected ? 'text' : 'muted'
				return (
					<Pressable
						key={i}
						onPress={() => {
							setSelected(i)
							onChange?.({ index: i, segment })
						}}
						backgroundColor={plain ? `transparent` : `bgLighter`}
						style={[
							styles.segment,
							i === 0 && styles.leftRounded,
							i === options.length - 1 && styles.rightRounded,
							isSelected && !plain ? elevation.level1 : {},
						]}>
						<View flexDirection={`row`} alignItems={`center`}>
							{segment.left && React.isValidElement(segment.left)
								? React.cloneElement(segment.left as ReactElement, {
										...((segment.left as ReactElement).props as TGeneric),
										color: textColor,
										style: [((segment.left as ReactElement).props as TGeneric)?.style],
									})
								: segment.left}
							<Text
								variant={`labelMedium`}
								color={textColor}
								style={{ marginLeft: segment.left ? 8 : 0 }}>
								{segment.label}
							</Text>
						</View>
					</Pressable>
				)
			})}
		</View>
	)
}
