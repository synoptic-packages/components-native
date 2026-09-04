import { Icon } from '../../icon/index'
import { Pressable } from '../../pressable/index'

interface ComponentProps {
	onPress?: () => void
	backgroundColor?: string
	testID?: string
}

export const Component: React.FC<ComponentProps> = ({ onPress, backgroundColor = `bg`, testID }) => {
	return (
		<Pressable
			width={42}
			height={42}
			borderRadius={21}
			backgroundColor={backgroundColor}
			alignItems={`center`}
			justifyContent={`center`}
			onPress={onPress}
			testID={testID}>
			<Icon family={`Synotech`} name={`SyClose`} color={`text`} size={24} />
		</Pressable>
	)
}
