import * as React from 'react'

import { pluralForClassName } from './emptyCopy'
import { Text } from '../../text'
import { View } from '../../view'
import { Component as ListIcon } from './Component.icon'

interface ComponentProps {
	className?: string
	refreshing?: boolean
	icon?: React.ReactNode
	title?: string
	description?: string
	testID?: string
}

const resolveLegacyTitle = (className?: string) => {
	const fallback = `items`
	const plural = pluralForClassName(className) || fallback
	return `${plural} not found`
}

export const Component: React.FC<ComponentProps> = ({
	icon,
	className,
	refreshing = false,
	title,
	description,
	testID,
}) => {
	const plural = pluralForClassName(className)

	const resolvedTitle = title || resolveLegacyTitle(className)
	const resolvedDescription =
		description || `Try adjusting your search options or creating a new ${plural === `items` ? `one` : `entry`}.`

	return refreshing ? (
		<></>
	) : (
		<View paddingVertical={32} paddingHorizontal={20} alignItems={`center`} gap={10} testID={testID}>
			{icon || <ListIcon name={`CircleOff`} size={60} />}
			<View height={8} />
			<Text variant={`titleMedium`} align={`center`}>
				{resolvedTitle}
			</Text>
			<Text color={`muted`} align={`center`}>
				{resolvedDescription}
			</Text>
		</View>
	)
}
