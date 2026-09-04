import { Pressable } from '../../pressable/index'
import { View } from '../../view/index'
import { useTheme } from '../../../hooks/useTheme'
import { BottomTabBarHeightCallbackContext, type BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { preferredForeground } from '../../../lib/color'
import { useContext, useEffect, type ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from './styles'

type TabRoute = BottomTabBarProps[`state`][`routes`][number]

const PILL_HEIGHT = 56
const PILL_PADDING = 8
const ICON_SIZE = 22

/** How far above the safe-area inset the pill floats. */
const BAR_BOTTOM_GAP = 8

/** The raised disc, and how much of it stands proud of the pill's top edge. */
const CENTER_SIZE = 60
const CENTER_RAISE = 24
const CENTER_ICON_SIZE = 26

/**
 * The gap reserved for the disc inside the tab row. Wider than the disc so the neighbouring tabs are
 * not crowded against a circle that overhangs them.
 */
const CENTER_SLOT = CENTER_SIZE + 20

/**
 * Every tab is the same width — `ICON_SIZE` (the widest thing a tab draws; the active dot is 4pt)
 * plus its horizontal padding on both sides. That is what lets an odd tab count be balanced with one
 * filler below, which is in turn what keeps the reserved slot on the pill's centre line.
 */
const TAB_PADDING = 14
const TAB_WIDTH = ICON_SIZE + TAB_PADDING * 2

/**
 * The bottom inset a scrolling surface needs so its last row clears the floating pill.
 *
 * The bar reports a height of ZERO (see below), so React Navigation reserves nothing for it and a
 * screen's content runs underneath — the one regression a floating bar reliably causes. This is the
 * pill's whole footprint above the safe-area inset, and nothing more: the shared `ScrollView`
 * already appends `insets.bottom + 20` of its own, which supplies the safe area and the air that
 * keeps the last row off the pill rather than touching it.
 *
 * The raised centre action deliberately does NOT widen it. The disc stands proud into a band that is
 * a gap by construction, and padding for it would push every screen's last row down by another 24pt
 * to clear a circle only the middle of the screen ever meets.
 */
export const FLOATING_TAB_BAR_CLEARANCE = PILL_HEIGHT + BAR_BOTTOM_GAP

/**
 * The clearance a surface needs when the bar carries a RAISED action and the content under it is
 * interactive.
 *
 * The paragraph above says the disc deliberately does not widen the clearance, and for TEXT that is
 * right — a circle in the middle of the screen meets a band that is a gap by construction. It is wrong
 * for a pressable row. Krugergold's asset list runs full width and every row navigates, so the disc sat
 * over the first row's centre and swallowed its taps: the row was visible, looked pressable, and opened
 * the scanner instead (`.project/findings/0175`).
 *
 * So this is the clearance for a screen whose last rows can be TAPPED, and the other constant stays
 * correct for a screen whose last content is read.
 */
export const FLOATING_TAB_BAR_RAISED_CLEARANCE = FLOATING_TAB_BAR_CLEARANCE + CENTER_RAISE

/**
 * The one raised action a floating bar may carry. It is NOT a tab: it never appears in
 * `state.routes`, never takes focus styling, and never emits a `tabPress`. It is a verb that
 * navigates, sitting where a fifth tab would be.
 *
 * `icon` mirrors React Navigation's own `tabBarIcon` signature rather than taking a rendered node,
 * because the bar owns the disc's fill and therefore owns which foreground reads on it. A caller that
 * passed a pre-coloured glyph would be re-deciding contrast at the call site — the exact hand-pairing
 * `docs/colors.md` forbids.
 */
export interface FloatingTabBarCenterAction {
	icon: (props: { color: string; size: number }) => ReactNode
	label: string
	testID: string
	onPress: () => void
}

export type ComponentProps = BottomTabBarProps & {
	centerAction?: FloatingTabBarCenterAction
}

/**
 * The floating tab bar: a compact surface pill that hugs its tabs and floats over the bottom inset,
 * with an optional raised action breaking above its centre.
 *
 * It is a COMPOSITION of shared primitives (View/Pressable), not a new primitive, and it is
 * theme-driven — a `bgLighter` surface carrying `text` glyphs — so it reads correctly in light AND
 * dark mode rather than being pinned dark. It also carries a scheme-picked token border (spec 049
 * item 4): `divider` in light, the tenant's `accent` in dark, because against a matching surface —
 * the owner's screenshot had carousel tiles behind it — an unbordered pill simply disappeared.
 * Tabs stay declared in `_layout.tsx`: this bar reads each route's `tabBarIcon`,
 * `tabBarButtonTestID` and title from the descriptors, so the Tabs.Screen config remains the single
 * source of truth and every existing `tab-*` testID keeps working.
 *
 * EVERY inactive glyph draws full `text` (spec 049 item 5); the ACTIVE glyph draws the themed focus
 * colour — `accent` in dark, `primary` in light (owner direction, 2026-08-14) — and the dot matches
 * it, so focus is one coherent colour on every glyph. `filled` is RETIRED from the tab bar: on an
 * open-stroke glyph it closed the path across its own endpoints and the focused tab carried LESS
 * information than the unfocused one (0163), and the colour now carries focus regardless of glyph
 * shape. There is deliberately no dimmed tint: it spent contrast to say what the dot already says.
 * The pill is content-width (the outer transparent container's `alignItems: center` stops it
 * stretching), which is what makes it float instead of reading as a full-width bar.
 *
 * It started life inside a product tree. A visual behaviour that appears twice is expressed once in the
 * shared system before its second use, so it moved here whole — `centerAction` is optional precisely so a
 * surface with no raised verb composes the same bar and renders exactly as it did.
 */
export const Component = ({ state, descriptors, navigation, centerAction }: ComponentProps) => {
	const { colors, isDark, setStylesheet } = useTheme()
	const insets = useSafeAreaInsets()
	const componentStyles = setStylesheet(styles)

	// Report a height of 0. React Navigation pads each screen's content by the tab bar's reported
	// height (default ~83), which is the solid band that sat behind the pill. Zeroing it lets the
	// screen content run to the bottom edge and the pill float over it on a transparent backdrop.
	// `FLOATING_TAB_BAR_CLEARANCE` above is how a scrolling screen buys that band back for itself.
	const setTabBarHeight = useContext(BottomTabBarHeightCallbackContext)
	useEffect(() => {
		setTabBarHeight?.(0)
	}, [setTabBarHeight])

	// Only the real tabs render. Expo Router STRIPS `href` from the descriptor options and turns
	// `href: null` into `tabBarItemStyle: { display: 'none' }` plus a null `tabBarButton` — so
	// `options.href` is undefined on EVERY route and filtering on it keeps all ~27 screens as empty
	// tabs, which is exactly the bug that split the bar wrong. `tabBarItemStyle.display === 'none'`
	// is the reliable hidden-screen signal.
	const visibleRoutes = state.routes.filter((route: TabRoute) => {
		const itemStyle = descriptors[route.key]?.options?.tabBarItemStyle as { display?: string } | undefined
		return itemStyle?.display !== `none`
	})

	// Honor the layout's `hiddenTabBar` contract: a map frame, a camera or a committed job flow sets
	// `tabBarStyle: { display: 'none' }` on its Tabs.Screen, and the bar must not float over it.
	// React Navigation's default bar reads this itself; a custom bar has to.
	const focusedRoute = state.routes[state.index]
	const focusedTabBarStyle = descriptors[focusedRoute?.key ?? ``]?.options?.tabBarStyle as
		| { display?: string }
		| undefined
	if (focusedTabBarStyle?.display === `none`) {
		return null
	}

	const onTabPress = (route: TabRoute, isFocused: boolean) => {
		const event = navigation.emit({ type: `tabPress`, target: route.key, canPreventDefault: true })
		if (!isFocused && !event.defaultPrevented) {
			navigation.navigate(route.name)
		}
	}

	const onTabLongPress = (route: TabRoute) => {
		navigation.emit({ type: `tabLongPress`, target: route.key })
	}

	const renderTab = (route: TabRoute) => {
		const options = descriptors[route.key]?.options
		const isFocused = state.routes[state.index]?.key === route.key
		// The active glyph draws the themed focus colour — `accent` in dark, `primary` in light — and
		// every glyph stays OUTLINED (`filled` is retired, 0163). Inactive glyphs draw full `text`.
		const iconColor = String(isFocused ? (isDark ? colors.accent : colors.primary) : colors.text)
		const icon = options?.tabBarIcon?.({
			focused: isFocused,
			color: iconColor,
			size: ICON_SIZE,
		})

		return (
			<Pressable
				key={route.key}
				testID={options?.tabBarButtonTestID}
				accessibilityRole={`button`}
				accessibilityLabel={
					options?.tabBarAccessibilityLabel ??
					(typeof options?.title === `string` ? options.title : route.name)
				}
				accessibilityState={isFocused ? { selected: true } : {}}
				onPress={() => onTabPress(route, isFocused)}
				onLongPress={() => onTabLongPress(route)}
				alignItems={`center`}
				gap={3}
				paddingVertical={4}
				paddingHorizontal={TAB_PADDING}>
				{icon}
				<View
					width={4}
					height={4}
					borderRadius={2}
					backgroundColor={isFocused ? (isDark ? `accent` : `primary`) : undefined}
					transparent={!isFocused}
				/>
			</Pressable>
		)
	}

	// The tabs split evenly around the reserved slot. An odd count is balanced with one filler of a
	// tab's width, because the disc is centred on the PILL and the slot has to be centred with it —
	// without that, a five-tab bar would draw the disc off its own gap.
	const half = Math.floor(visibleRoutes.length / 2)
	const leftRoutes = centerAction ? visibleRoutes.slice(0, half) : visibleRoutes
	const rightRoutes = centerAction ? visibleRoutes.slice(half) : []
	const fillerSide = centerAction && rightRoutes.length > leftRoutes.length ? `left` : `right`
	const needsFiller = Boolean(centerAction) && leftRoutes.length !== rightRoutes.length

	// The label sits on the service's own brand fill — `#B8860B` here. Nothing stops a brand token being
	// a pale gold that white fails against, so the glyph colour is MEASURED against the fill rather than
	// assumed, exactly as the shared `Badge` does it.
	const centerFill = String(colors.primary)
	const centerForeground = preferredForeground(centerFill, String(colors.white), String(colors.text))

	// The bar is absolutely positioned and reports height 0, so it overlays the screen rather than
	// reserving a band. `pointerEvents="box-none"` lets touches fall through the transparent backdrop
	// to the content beneath while the pill itself stays tappable — and it runs the whole way down the
	// chain, because the raised disc is drawn inside the assembly's own bounds. Android does not
	// dispatch a touch to a child drawn outside its parent, so the assembly reserves `CENTER_RAISE` of
	// padding rather than letting the disc hang out of it; that padding is what keeps the proud half
	// of the disc tappable.
	return (
		<View position={`absolute`} top={0} right={0} bottom={0} left={0} pointerEvents={`box-none`}>
			<View
				flex={1}
				justifyContent={`flex-end`}
				alignItems={`center`}
				paddingBottom={insets.bottom + BAR_BOTTOM_GAP}
				pointerEvents={`box-none`}>
				<View alignItems={`center`} paddingTop={centerAction ? CENTER_RAISE : 0} pointerEvents={`box-none`}>
					<View
						backgroundColor={`bgLighter`}
						borderRadius={PILL_HEIGHT / 2}
						borderWidth={1}
						borderColor={isDark ? `accent` : `divider`}
						height={PILL_HEIGHT}
						flexDirection={`row`}
						alignItems={`center`}
						paddingHorizontal={PILL_PADDING}
						style={[componentStyles.pillShadow]}>
						{needsFiller && fillerSide === `left` ? <View width={TAB_WIDTH} /> : null}
						{leftRoutes.map(renderTab)}
						{centerAction ? <View width={CENTER_SLOT} /> : null}
						{rightRoutes.map(renderTab)}
						{needsFiller && fillerSide === `right` ? <View width={TAB_WIDTH} /> : null}
					</View>
					{centerAction ? (
						<View
							position={`absolute`}
							top={0}
							left={0}
							right={0}
							alignItems={`center`}
							pointerEvents={`box-none`}
							style={[componentStyles.centerLayer]}>
							<Pressable
								testID={centerAction.testID}
								accessibilityRole={`button`}
								accessibilityLabel={centerAction.label}
								onPress={centerAction.onPress}
								width={CENTER_SIZE}
								height={CENTER_SIZE}
								borderRadius={CENTER_SIZE / 2}
								backgroundColor={`primary`}
								flexCenter
								style={[componentStyles.centerShadow]}>
								{centerAction.icon({ color: centerForeground, size: CENTER_ICON_SIZE })}
							</Pressable>
						</View>
					) : null}
				</View>
			</View>
		</View>
	)
}

export default Component
