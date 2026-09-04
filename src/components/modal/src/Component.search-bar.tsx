/**
 * Search header used inside `ModalFormField`.
 *
 * Adapted from the mobile source: the app-coupled `useNavigation()` back behaviour is replaced by the
 * `onBackPress` prop (always provided by `ModalFormField`, which closes the sheet itself). No expo
 * router / react-navigation dependency.
 */
import type { TGeneric } from '../../../types'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import type { ColorName } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { Icon } from '../../icon'
import { Text } from '../../text'
import { TouchableOpacity } from '../../touchable-opacity'
import { View } from '../../view'
import { styles } from './styles.search-bar'

type ComponentProps = {
	onSearch?: TGeneric
	onBackPress?: () => void
	textAction?: string
	textPlaceholder?: string
	backgroundColor?: ColorName
	autoSearch?: boolean
	autoFocus?: boolean
}

export const Component: React.FC<ComponentProps> = (props) => {
	const {
		onSearch,
		autoFocus = true,
		onBackPress,
		backgroundColor = `bg`,
		textPlaceholder = `Enter search term`,
		textAction = `Search`,
		autoSearch = true,
	} = props
	const { isDark, colors, setStylesheet } = useTheme()
	const [query, setQuery] = useState('')
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const componentStyles = setStylesheet(styles)

	useEffect(() => {
		if (onSearch && typeof onSearch === 'function') {
			onSearch('')
		}
		setQuery('')
	}, [onSearch])

	return (
		<View style={componentStyles.searchBar}>
			<TouchableOpacity
				onPress={() => {
					if (typeof onBackPress === 'function') {
						onBackPress()
					}
				}}
				flexCenter={true}
				paddingHorizontal={8}>
				<Icon family={`Ionicons`} name={`arrow-back-sharp`} size={24} color={isFocused ? `muted` : `text`} />
			</TouchableOpacity>
			<View backgroundColor={backgroundColor} style={componentStyles.inputColumn}>
				<Icon
					family={`Ionicons`}
					name={`search`}
					size={20}
					color={isFocused ? `text` : `mutedLight`}
					style={componentStyles.iconSearch}
				/>
				<TextInput
					style={[componentStyles.inputField, { color: colors?.text }]}
					placeholderTextColor={colors?.mutedLight}
					underlineColorAndroid={`transparent`}
					selectionColor={colors?.text}
					placeholder={textPlaceholder}
					autoFocus={autoFocus}
					clearTextOnFocus={true}
					clearButtonMode={`while-editing`}
					autoCapitalize={`none`}
					autoComplete={`off`}
					enterKeyHint={`search`}
					returnKeyType={`search`}
					returnKeyLabel={`search`}
					autoCorrect={false}
					value={query}
					onChangeText={(text) => {
						setQuery(text)
						if (autoSearch && typeof onSearch === 'function') {
							onSearch(text)
						}
					}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
			</View>
			<TouchableOpacity flexCenter={true} paddingHorizontal={8} onPress={() => onSearch(query)}>
				<Text variant={`labelLarge`} color={isDark ? `accent` : `primary`}>
					{textAction}
				</Text>
			</TouchableOpacity>
		</View>
	)
}
