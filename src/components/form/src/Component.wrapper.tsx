import React from 'react'
import { Component as FormModal } from './Component.modal'
import type { FormHeaderAction } from './types'

interface IComponentProps {
	asModal?: boolean
	closeForm?: () => void
	title?: string
	name: string
	headerAction?: FormHeaderAction
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	children: React.ReactNode
	testID?: string
}

export const Component: React.FC<IComponentProps> = ({
	asModal,
	closeForm,
	name = 'stack-modal',
	title,
	headerAction,
	children,
}) => {
	if (asModal) {
		return (
			<FormModal
				asModal={asModal}
				open={true}
				onClose={closeForm}
				title={title as string}
				name={name}
				headerAction={headerAction}>
				{children}
			</FormModal>
		)
	}

	return <React.Fragment>{children}</React.Fragment>
}

Component.displayName = 'FormWrapper'
