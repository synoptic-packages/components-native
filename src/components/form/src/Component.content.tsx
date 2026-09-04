import { Alert } from '../../alert/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import * as React from 'react'
import { styles } from './styles.content'

interface ComponentProps {
	title?: string
	subTitle?: React.ReactNode
	error?: string | null
	success?: string | null
	action?: React.ReactNode
	hideTitle?: boolean
	avatar?: {
		src: string
		alt: string
	}
	children?: React.ReactNode
	asModal?: boolean
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({
	children,
	error,
	success,
	title,
	subTitle,
	hideTitle,
	action,
	asModal,
	testID,
}) => {
	return (
		<View testID={testID}>
			{!hideTitle ? (
				<View style={styles.header}>
					{title ? (
						<Text size={30} variant={`displayMedium`} align={`center`}>
							{title}
						</Text>
					) : null}
					{subTitle ? (
						<Text color={`muted`} align={`center`} variant={`bodyLarge`} fontSize={19}>
							{subTitle}
						</Text>
					) : null}
					{action ? <View style={styles.action}>{action}</View> : null}
				</View>
			) : null}

			{error ? (
				<React.Fragment>
					<Alert severity={`error`} variant={`filled`} message={error} />
					<View height={20} />
				</React.Fragment>
			) : null}
			{success ? (
				<React.Fragment>
					<Alert severity={`success`} variant={`filled`} message={success} />
					<View height={20} />
				</React.Fragment>
			) : null}

			<View style={{ ...styles.body, ...(asModal && { borderRadius: 0 }) }}>{children}</View>
		</View>
	)
}

Component.displayName = 'FormContent'
