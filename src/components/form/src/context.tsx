import React from 'react'

import type { FormHeaderAction } from './types'

interface FormHeaderContextValue {
	setHeaderAction: (action: FormHeaderAction | null) => void
}

export const FormHeaderContext = React.createContext<FormHeaderContextValue | null>(null)

export const useFormHeaderAction = () => React.useContext(FormHeaderContext)
