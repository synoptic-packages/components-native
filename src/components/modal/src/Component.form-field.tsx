import type { TGeneric } from '../../../types'
import { initials } from '../../../lib/string'
import { Flag } from '@synotech/flags'
import React, { useCallback, useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import { Avatar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { deviceHeight, deviceWidth } from '../../../constants'
import { useTheme } from '../../../hooks/useTheme'
import { ListItem } from '../../list'
import { SafeAreaView, View } from '../../view'
import { Component as Modal } from './Component'
import { Icon } from '../../icon'
import { Component as SearchBar } from './Component.search-bar'

interface Props {
	isVisible: boolean
	onBackdropPress?: () => void
	setIsVisible: (_?: boolean | TGeneric) => void
	onModalHide?: () => void
	onSelect?: (_: TGeneric) => void
	children: React.ReactNode
	template?: 'country' | 'language' | 'crypto' | 'currency' | 'person' | 'pointer'
	options: {
		label: string
		value: TGeneric
		[key: string]: TGeneric
	}[]
}

const ITEM_HEIGHT = 48

export const Component: React.FC<Props> = ({ options, isVisible, setIsVisible, onSelect, template }) => {
	const { colors } = useTheme()
	const { top } = useSafeAreaInsets()
	const [searchQuery, setSearchQuery] = useState<string>('')

	const filteredOptions = useMemo(() => {
		if (!searchQuery) return options
		return options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
	}, [options, searchQuery])

	const getItemLayout = useCallback(
		(_: any, index: number) => ({
			length: ITEM_HEIGHT,
			offset: ITEM_HEIGHT * index,
			index,
		}),
		[]
	)

	const keyExtractor = useCallback((item: TGeneric, i: number) => item?.code || i.toString(), [])

	const renderItem = useCallback(
		({ item, index: i }: { item: TGeneric; index: number }) => {
			return (
				<ListItem
					key={i}
					testID={
						typeof item?.value === 'string' || typeof item?.value === 'number'
							? `modal-option-${item.value}`
							: undefined
					}
					left={
						item.left ? (
							item.left
						) : template === 'country' ? (
							<Flag code={item?.value?.toLowerCase()} size={24} />
						) : template === 'language' ? (
							<Flag code={item?.flag?.toLowerCase()} size={24} />
						) : template === 'crypto' ? (
							<Icon name={item?.slug || 'SyCoins'} size={18} color={item?.colorDark ? 'white' : 'black'} />
						) : template === 'currency' ? (
							<Flag code={item?.flag?.toLowerCase()} size={24} />
						) : template === 'pointer' ? (
							<Flag code={item?.flag?.toLowerCase()} size={24} />
						) : template === 'person' ? (
							<Avatar.Text label={initials(item?.label) || ``} size={24} />
						) : null
					}
					height={46}
					title={item?.label}
					subTitle={item?.subTitle}
					onPress={() => {
						if (typeof onSelect === 'function') {
							onSelect(item)
						}

						setIsVisible(false)
					}}
					isLast={i === options?.length - 1}
				/>
			)
		},
		[onSelect, options?.length, setIsVisible, template]
	)

	if (options.length === 0) return null

	return (
		<Modal isVisible={isVisible} setIsVisible={setIsVisible}>
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: colors.modalOpacity,
					overflow: `hidden`,
					height: deviceHeight - 20,
				}}>
				<View minHeight={top + 20} width={`100%`} />
				<View
					flex={1}
					flexGrow={1}
					width={deviceWidth}
					backgroundColor={`bg`}
					paddingTop={8}
					borderTopLeftRadius={16}
					borderTopRightRadius={16}
					overflow={`hidden`}>
					<SearchBar
						backgroundColor={`bgLighter`}
						textPlaceholder={`Enter search term`}
						onBackPress={() => setIsVisible?.(false)}
						onSearch={(text: string) => setSearchQuery(text)}
					/>
					{filteredOptions.length === 0 ? (
						<View flex={1} alignItems={`center`} justifyContent={`center`} padding={16}>
							<ListItem title={`No results found`} height={46} />
						</View>
					) : (
						<FlatList
							style={{ marginTop: 8, width: '100%' }}
							showsVerticalScrollIndicator={false}
							data={filteredOptions}
							removeClippedSubviews
							initialNumToRender={10}
							maxToRenderPerBatch={5}
							windowSize={10}
							keyExtractor={keyExtractor}
							getItemLayout={getItemLayout}
							renderItem={renderItem}
						/>
					)}
				</View>
			</SafeAreaView>
		</Modal>
	)
}
