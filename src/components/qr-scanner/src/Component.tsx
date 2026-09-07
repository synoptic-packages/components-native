import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '../../button/index'
import { Icon } from '../../icon/index'
import { Text } from '../../text/index'
import { View } from '../../view/index'
import { styles } from './styles'

export interface QrScannerProps {
	onScan: (_value: string) => void
	paused?: boolean
	testID?: string
	permissionTitle?: string
	permissionBody?: string
	allowCameraLabel?: string
	errorTitle?: string
	errorBody?: string
	retryLabel?: string
	hint?: string
}

export const QR_SCANNER_AVAILABLE = true

/**
 * QR barcode scanner. Ported from ventry `qr-scanner`; the only adaptation is
 * i18n — ventry read copy from `react-i18next` keys, the library takes the
 * same strings as props defaulting to the ventry English copy, so hosts keep
 * owning their translations.
 */
export const Component: React.FC<QrScannerProps> = ({
	onScan,
	paused = false,
	testID,
	permissionTitle = `Camera permission required`,
	permissionBody = `Allow camera access to scan a QR code.`,
	allowCameraLabel = `Allow camera`,
	errorTitle = `Scanner unavailable`,
	errorBody = `We could not start the QR scanner. Try again or use another device.`,
	retryLabel = `Try again`,
	hint = `Point the camera at a QR code`,
}) => {
	const [permission, requestPermission] = useCameraPermissions()
	const [permissionRequested, setPermissionRequested] = useState(false)
	const [scannerError, setScannerError] = useState(false)
	const consumedValue = useRef<string | null>(null)

	const hasPermission = permission?.granted === true

	useEffect(() => {
		if (hasPermission || permissionRequested) return
		setPermissionRequested(true)
		void requestPermission()
	}, [hasPermission, permissionRequested, requestPermission])

	useEffect(() => {
		if (!paused) consumedValue.current = null
	}, [paused])

	const handleScanned = useCallback(
		(result: BarcodeScanningResult) => {
			if (paused) return
			const value = result.data?.trim()
			if (!value || consumedValue.current === value) return
			consumedValue.current = value
			onScan(value)
		},
		[onScan, paused]
	)

	const requestCameraPermission = useCallback(() => {
		setPermissionRequested(true)
		void requestPermission()
	}, [requestPermission])

	if (!hasPermission) {
		return (
			<View flex={1} flexCenter padding={32} gap={16} backgroundColor={`bg`} testID={testID}>
				<Icon family={`Lucide`} name={`CameraOff`} size={44} color={`muted`} />
				<Text variant={`titleMedium`} bold align={`center`}>
					{permissionTitle}
				</Text>
				<Text align={`center`} color={`muted`}>
					{permissionBody}
				</Text>
				<Button mode={`contained`} onPress={requestCameraPermission} testID={`${testID}-permission`}>
					{allowCameraLabel}
				</Button>
			</View>
		)
	}

	if (scannerError) {
		return (
			<View flex={1} flexCenter padding={32} gap={16} backgroundColor={`bg`} testID={testID}>
				<Icon family={`Lucide`} name={`ScanLine`} size={44} color={`error`} />
				<Text variant={`titleMedium`} bold align={`center`}>
					{errorTitle}
				</Text>
				<Text align={`center`} color={`muted`}>
					{errorBody}
				</Text>
				<Button mode={`outlined`} onPress={() => setScannerError(false)} testID={`${testID}-retry`}>
					{retryLabel}
				</Button>
			</View>
		)
	}

	return (
		<View flex={1} backgroundColor={`black`} testID={testID} accessible={false}>
			<CameraView
				style={styles.camera}
				facing={`back`}
				active={!paused}
				barcodeScannerSettings={{ barcodeTypes: [`qr`] }}
				onBarcodeScanned={paused ? undefined : handleScanned}
				onMountError={() => setScannerError(true)}
			/>
			<View
				position={`absolute`}
				left={24}
				right={24}
				bottom={32}
				padding={12}
				backgroundColor={`black`}
				accessible={true}
				accessibilityRole={`text`}
				accessibilityLabel={hint}>
				<Text align={`center`} color={`white`}>
					{hint}
				</Text>
			</View>
		</View>
	)
}
