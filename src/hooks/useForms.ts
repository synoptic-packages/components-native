/**
 * Form context for the shared `Form` component.
 *
 * Adapted from the mobile app's `context/context-forms` (the renderer/provider in that module was
 * backend-coupled — it rendered tenant `FormsRender` and read `useParseAuth` — so it is NOT copied).
 * This package ships only the context contract + `useForms()` hook; hosts that want the modal-render
 * behaviour wrap their own provider with the same shape and render their own forms.
 */
import { createContext, useContext } from 'react'
import type { TGeneric } from '../types'

export interface FormHookProps {
	asModal?: boolean
	name?: string
	feature?: string
	id?: string | number
	objectId?: string | number
	title?: string
	values?: Record<string, any> | TGeneric
	visible?: boolean
	afterSave?: (_data?: TGeneric) => Promise<TGeneric> | TGeneric
	closeForm?: () => void
}

export const initialFormState: FormHookProps = {
	asModal: false,
	name: undefined,
	id: undefined,
	objectId: undefined,
	title: undefined,
	values: undefined,
	visible: false,
	afterSave: undefined,
	closeForm: undefined,
}

export interface FormContextType {
	form: FormHookProps
	openForm: (form: FormHookProps) => void
	closeForm: () => void
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

FormContext.displayName = 'FormContext'

export const useForms = (): FormContextType => {
	const context = useContext(FormContext)
	if (context === undefined) {
		throw new Error('useForms must be used within a FormContext.Provider')
	}
	return context
}
