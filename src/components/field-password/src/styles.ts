import type { StyleObject } from '../../../hooks/useTheme'

export const styles = {
	indicatorContainer: {
		marginTop: 6,
		paddingHorizontal: 4,
	},
	indicatorBar: {
		height: 4,
		borderRadius: 2,
		marginBottom: 8,
		marginHorizontal: 12,
	},
	requirementsContainer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 16,
		backgroundColor: 'bg',
	},
	requirementsTitle: {
		marginBottom: 6,
	},
	requirementItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
		opacity: 0.7,
	},
	requirementText: {
		marginLeft: 8,
		fontSize: 11,
		flex: 1,
	},
} as const satisfies StyleObject
