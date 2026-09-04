import React from 'react'

interface ComponentProps {
	children: React.ReactNode
}
export const Component: React.FC<ComponentProps> = ({ children }) => {
	if (!__DEV__) return null

	return <React.Fragment>{children}</React.Fragment>
}
