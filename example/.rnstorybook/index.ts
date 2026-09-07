import AsyncStorage from '@react-native-async-storage/async-storage'
import { view } from './storybook.requires'

const StorybookUIRoot = view.getStorybookUI({
	storage: {
		getItem: AsyncStorage.getItem,
		setItem: AsyncStorage.setItem,
	},
	// Maestro runs pin a story at bundle time (Metro reads EXPO_PUBLIC_*
	// vars): EXPO_PUBLIC_SB_STORY="QA/Gallery--Default". Unset locally and
	// the persisted selection behaviour is unchanged.
	...(process.env.EXPO_PUBLIC_SB_STORY
		? { initialSelection: process.env.EXPO_PUBLIC_SB_STORY as `${string}--${string}` }
		: {}),
})

export default StorybookUIRoot
