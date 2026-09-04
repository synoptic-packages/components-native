import {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
	FontAwesome6,
	Fontisto,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Octicons,
	SimpleLineIcons,
	Zocial,
} from '@expo/vector-icons'
import * as SynotechIcons from '@synotech/icons/react-native'
import * as LucideIcons from 'lucide-react-native/icons'
import * as React from 'react'
import { Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { ErrorBoundary } from '../../error-boundary'

type LucideIconName = keyof typeof LucideIcons
type SynotechIconsName = keyof typeof SynotechIcons
const DEFAULT_LUCIDE_STROKE_WIDTH = 1.2

type VectorFamily =
	| 'AntDesign'
	| 'Entypo'
	| 'EvilIcons'
	| 'Feather'
	| 'FontAwesome'
	| 'FontAwesome5'
	| 'FontAwesome6'
	| 'Fontisto'
	| 'Foundation'
	| 'Ionicons'
	| 'MaterialCommunityIcons'
	| 'MaterialIcons'
	| 'Octicons'
	| 'SimpleLineIcons'
	| 'Zocial'

type CustomFamily = 'Lucide' | 'Synotech'
type SynotechIconComponent = React.ComponentType<SvgProps>
type LucideIconComponent = React.ComponentType<any>
const synotechIconMap = SynotechIcons as Record<string, SynotechIconComponent>
const lucideIconMap = LucideIcons as Record<string, LucideIconComponent>

export type IconName = SynotechIconsName | LucideIconName | string
export type IconFamily = VectorFamily | CustomFamily

export type ComponentProps = {
	name: IconName
	family?: IconFamily
	backgroundStyle?: StyleProp<ViewStyle>
	onPress?: () => void
	muted?: boolean
	disabled?: boolean
	size?: number
	strokeWidth?: number
	absoluteStrokeWidth?: boolean
	/**
	 * Lucide only. Fills the glyph with `color` instead of leaving it an open stroke — the flat,
	 * solid treatment a rating star or status badge wants. Lucide's default is `fill="none"`, so
	 * leaving this unset keeps every existing icon stroked; it is opt-in per call site, never a
	 * global change. Synotech and the vector families always render their own geometry and ignore it.
	 *
	 * FILL OR STROKE, never both — the glyph is painted one way or the other.
	 */
	filled?: boolean
	testID?: string
	accessibilityLabel?: string
	color?: ColorName | string
	position?: string
	style?: StyleProp<ViewStyle | TextStyle>
}

const vectorIconsMap = {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
	FontAwesome6,
	Fontisto,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Octicons,
	SimpleLineIcons,
	Zocial,
} satisfies Record<VectorFamily, React.ComponentType<any>>

const isSynotechIconName = (name: IconName): name is SynotechIconsName => {
	return Object.prototype.hasOwnProperty.call(synotechIconMap, name)
}

const isLucideIconName = (name: IconName): name is LucideIconName => {
	return Object.prototype.hasOwnProperty.call(lucideIconMap, name)
}

const resolveFamily = (family: IconFamily | undefined, name: IconName): IconFamily | undefined => {
	if (family) {
		return family
	}

	if (isSynotechIconName(name)) {
		return 'Synotech'
	}

	if (isLucideIconName(name)) {
		return 'Lucide'
	}

	return undefined
}

export const Component: React.FC<ComponentProps> = (props) => {
	const {
		color,
		family,
		backgroundStyle,
		onPress,
		disabled,
		style,
		strokeWidth,
		absoluteStrokeWidth,
		filled,
		...restProps
	} = props
	// A pressable icon must carry its identity on the PRESSABLE, not on the glyph inside it.
	// React Native collapses an accessible container's descendants into one node, so a `testID` set on
	// the inner SVG disappears from the native tree the moment `onPress` wraps it — which made every
	// icon-only control in the app (header actions, close buttons, inline edits) impossible to select
	// by id, from Maestro or from a screen reader. Discovered when a header action was present on screen
	// and invisible to a Maestro `assertVisible` on that action's own testID.
	const pressableProps = {
		testID: props.testID,
		accessible: true,
		accessibilityRole: 'button' as const,
		accessibilityLabel: props.accessibilityLabel,
		accessibilityState: { disabled: Boolean(disabled) },
	}
	const { colors } = useTheme()
	const iconColor = color && color in colors ? colors[color as ColorName] : color || colors.text
	const resolvedFamily = resolveFamily(family, props.name)

	if (!resolvedFamily) {
		return null
	}

	if (resolvedFamily === 'Synotech') {
		const IconAbstract = isSynotechIconName(props.name) ? synotechIconMap[props.name] : null

		if (!IconAbstract) {
			return null
		}

		const icon = (
			<IconAbstract width={props.size} height={props.size} color={iconColor} fill={iconColor} style={style} />
		)

		if (backgroundStyle || onPress) {
			return (
				<ErrorBoundary>
					<Pressable
						{...pressableProps}
						style={[backgroundStyle, { justifyContent: 'center', alignItems: 'center' }]}
						disabled={disabled}
						onPress={onPress}>
						{icon}
					</Pressable>
				</ErrorBoundary>
			)
		}

		return <ErrorBoundary>{icon}</ErrorBoundary>
	}

	if (resolvedFamily === 'Lucide') {
		const IconAbstract = isLucideIconName(props.name) ? lucideIconMap[props.name] : null

		if (!IconAbstract) {
			return null
		}

		const icon = (
			<IconAbstract
				size={props.size}
				color={iconColor}
				fill={filled ? iconColor : `none`}
				// FILL AND STROKE ARE MUTUALLY EXCLUSIVE. A filled glyph paints its fill only; an unfilled
				// one strokes only. Painting both put a 1.2px same-colour stroke on top of a same-colour
				// fill, which grows the silhouette by ~0.6px all round and thickens every interior detail.
				//
				// `stroke` lands in lucide's `...rest`, which is spread AFTER its own
				// `stroke: color ?? contextColor` and is then applied to every child node — so this
				// overrides the stroke on the glyph and all of its subpaths, not just the outer `Svg`.
				stroke={filled ? `none` : iconColor}
				strokeWidth={strokeWidth ?? DEFAULT_LUCIDE_STROKE_WIDTH}
				absoluteStrokeWidth={absoluteStrokeWidth}
				style={style}
				// Only when unwrapped: the Pressable branch below owns the id instead, so it is never
				// declared on two nodes at once.
				testID={backgroundStyle || onPress ? undefined : props.testID}
			/>
		)

		if (backgroundStyle || onPress) {
			return (
				<ErrorBoundary>
					<Pressable
						{...pressableProps}
						style={[backgroundStyle, { justifyContent: 'center', alignItems: 'center' }]}
						disabled={disabled}
						onPress={onPress}>
						{icon}
					</Pressable>
				</ErrorBoundary>
			)
		}

		return <ErrorBoundary>{icon}</ErrorBoundary>
	}

	const IconAbstract = vectorIconsMap[resolvedFamily]

	if (backgroundStyle || onPress) {
		return (
			<ErrorBoundary>
				<Pressable
					{...pressableProps}
					style={[backgroundStyle, { justifyContent: 'center', alignItems: 'center' }]}
					disabled={disabled}
					onPress={onPress}>
					<IconAbstract
						style={[{ color: iconColor, justifyContent: 'center', alignItems: 'center' }, style]}
						{...restProps}
					/>
				</Pressable>
			</ErrorBoundary>
		)
	} else {
		return (
			<ErrorBoundary>
				<IconAbstract
					style={[{ color: iconColor, justifyContent: 'center', alignItems: 'center' }, style]}
					{...restProps}
				/>
			</ErrorBoundary>
		)
	}
}
