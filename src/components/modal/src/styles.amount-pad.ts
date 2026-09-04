import type { StyleObject } from '../../../hooks/useTheme'

// `SafeAreaView` is a third-party component, so its surface cannot be expressed as inline props the way
// the shared `View`/`Pressable`/`Text` can. `setStylesheet` resolves the `bg` token by name.
export const styles = {
	surface: {
		backgroundColor: 'bg',
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
} as const satisfies StyleObject
