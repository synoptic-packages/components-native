import { View } from '../../view'
import { useIsFocused } from '@react-navigation/native'
import { forwardRef } from 'react'
import { Component as Map } from './Component'
import type { MapHandle, MapProps } from './types'

/**
 * Renders the map only while its screen is focused, so an off-screen map does not hold a GL surface
 * and a location subscription open.
 *
 * The unfocused branch is a plain background-coloured View — visually identical to a map that mounted
 * and drew nothing. It now carries its own testID so the two are distinguishable. A flow asserting a
 * wrapper *around* this component passes either way, which is exactly how a blank map on the confirm
 * screen went unnoticed. Assert `map-unfocused`'s ABSENCE when you mean "the map actually rendered".
 */
export const Component = forwardRef<MapHandle, MapProps>(function FocusAwareMap(props, forwardedRef) {
	const isFocused = useIsFocused()

	if (!isFocused) {
		return <View flex={1} backgroundColor={`bg`} style={props.style} testID={`map-unfocused`} />
	}

	return <Map ref={forwardedRef} {...props} />
})

Component.displayName = 'FocusAwareMap'
