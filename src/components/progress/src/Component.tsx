import type { StyleProp, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { Text } from '../../text/index'
import { useTheme } from '../../../hooks/useTheme'
import { styles } from './styles'

export interface ComponentProps {
	barStyle?: StyleProp<ViewStyle>
	color?: string
	label?: string
	progress: number
	/**
	 * Draw the bar as N discrete segments instead of one continuous fill.
	 *
	 * A continuous bar answers "how far along a quantity" — a download, a form's completion. A journey
	 * with named, server-owned stages is a different question: the rider wants to know WHICH STAGE they
	 * are in, and a bar sitting at 0.6 does not say that. Segments do, in the same 4pt of height and
	 * with no words, which is why the ride-hailing benchmark uses them over a live trip.
	 *
	 * The fill is `round(progress * segments)`, so a caller passes the same 0–1 `progress` either way
	 * and the two modes cannot disagree about how far along something is.
	 */
	segments?: number
	testID?: string
}

export const Component = ({ barStyle, color, label, progress, segments, testID }: ComponentProps) => {
	const { colors } = useTheme()
	const clamped = Math.max(0, Math.min(1, progress))
	const fill = color ?? String(colors.primary)
	// `#e5e7eb` was hardcoded here. It is a light grey, so the unfilled track stayed near-white on a
	// dark surface — the one place the bar is most visible — and it ignored the tenant palette entirely.
	// `divider` is the semantic token for exactly this: a low-contrast rule against the current surface.
	const track = String(colors.divider)

	if (segments && segments > 0) {
		const filled = Math.round(clamped * segments)
		return (
			<View style={styles.container} testID={testID}>
				{label ? <Text color={colors.muted}>{label}</Text> : null}
				<View style={styles.segments}>
					{Array.from({ length: segments }, (_unused, index) => (
						<View
							key={index}
							style={[styles.segment, { backgroundColor: index < filled ? fill : track }, barStyle]}
						/>
					))}
				</View>
			</View>
		)
	}

	return (
		<View style={styles.container} testID={testID}>
			{label ? <Text color={colors.muted}>{label}</Text> : null}
			<ProgressBar
				color={fill}
				progress={clamped}
				style={[styles.bar, barStyle, { backgroundColor: clamped === 0 ? String(colors.mutedLight) : track }]}
			/>
		</View>
	)
}
