// ElevationStyles.js
import { Platform } from 'react-native'

/**
 * A comprehensive reusable elevation stylesheet for React Native
 * providing consistent shadow effects from levels 0-10
 *
 * Usage:
 * import ElevationStyles from './path/to/ElevationStyles';
 *
 * <View style={[styles.yourStyle, ElevationStyles.elevation5]} />
 **/

const elevation = {
	/**
	 * Level 0: No elevation
	 */
	level0: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 0 },
				shadowOpacity: 0,
				shadowRadius: 0,
			},
			android: {
				elevation: 0,
			},
			web: {
				boxShadow: 'none',
			},
		}),
	},

	/**
	 * Level 1: Subtle elevation (cards, buttons at rest)
	 */
	level1: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.1,
				shadowRadius: 1.0,
			},
			android: {
				elevation: 1,
			},
			web: {
				boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
			},
		}),
	},

	/**
	 * Level 2: Low elevation (pressed buttons, selected cards)
	 */
	level2: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.2,
				shadowRadius: 1.41,
			},
			android: {
				elevation: 2,
			},
			web: {
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.14)',
			},
		}),
	},

	/**
	 * Level 3: Medium-low elevation (menus, snackbars)
	 */
	level3: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.22,
				shadowRadius: 2.22,
			},
			android: {
				elevation: 3,
			},
			web: {
				boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.16)',
			},
		}),
	},

	/**
	 * Level 4: Medium elevation (navigation drawers, app bars)
	 */
	level4: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.23,
				shadowRadius: 2.62,
			},
			android: {
				elevation: 4,
			},
			web: {
				boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.18)',
			},
		}),
	},

	/**
	 * Level 5: Medium-high elevation (floating action buttons at rest)
	 */
	level5: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
			},
			android: {
				elevation: 5,
			},
			web: {
				boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.20)',
			},
		}),
	},

	/**
	 * Level 6: High elevation (floating action buttons on press)
	 */
	level6: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.27,
				shadowRadius: 4.65,
			},
			android: {
				elevation: 6,
			},
			web: {
				boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.22)',
			},
		}),
	},

	/**
	 * Level 7: Very high elevation (dialogs)
	 */
	level7: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.29,
				shadowRadius: 4.65,
			},
			android: {
				elevation: 7,
			},
			web: {
				boxShadow: '0px 7px 12px rgba(0, 0, 0, 0.24)',
			},
		}),
	},

	/**
	 * Level 8: Extremely high elevation (pickers, modals)
	 */
	level8: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.3,
				shadowRadius: 4.65,
			},
			android: {
				elevation: 8,
			},
			web: {
				boxShadow: '0px 8px 14px rgba(0, 0, 0, 0.26)',
			},
		}),
	},

	/**
	 * Level 9: Ultra high elevation (full-screen dialogs)
	 */
	level9: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.32,
				shadowRadius: 5.46,
			},
			android: {
				elevation: 9,
			},
			web: {
				boxShadow: '0px 9px 16px rgba(0, 0, 0, 0.28)',
			},
		}),
	},

	/**
	 * Level 10: Maximum elevation (front layer in bottom sheets)
	 */
	level10: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 5 },
				shadowOpacity: 0.34,
				shadowRadius: 6.27,
			},
			android: {
				elevation: 10,
			},
			web: {
				boxShadow: '0px 10px 18px rgba(0, 0, 0, 0.30)',
			},
		}),
	},
}

export default elevation
