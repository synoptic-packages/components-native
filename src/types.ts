import type { CountryCode } from 'libphonenumber-js'
import type { FieldValues, UseControllerProps } from 'react-hook-form'

export type TGeneric = Record<string, any> | string | number | boolean | null | undefined | any
export type ValidationRules = UseControllerProps<FieldValues>['rules']
export type ColorScheme = 'light' | 'dark'

export type Option = {
	value: string
	label: string
	flag?: string
	[key: string]: any
}

export interface PhoneNumberInterface {
	countryCode: CountryCode | TGeneric
	national?: string
	international?: string
	type?: 'mobile' | 'landline' | 'unknown'
}

export interface AddressInterface {
	address: string
	country: string
	country_name: string
	state: string
	state_name: string
	town: string
	municipality: string
	location: string
}

export interface PlaceInterface {
	types: string[]
	name: string
	displayName: {
		text: string
	}
	formattedAddress: string
	shortFormattedAddress: string
	addressComponents: string[]
	location: {
		latitude: string
		longitude: string
	}
}

export interface Language {
	label: Record<string, string>
	code: string
	fallbackLocale: string
	rtl: boolean
	flag: string
}

export interface Currency {
	code: string
	symbol: string
	name: {
		common: string
		ar: string
		de: string
		en: string
		es: string
		fr: string
		hi: string
		ja: string
		ko: string
		pt: string
		ru: string
		tr: string
		zh: string
	}
	flag: string
	order: number
}

export interface Country {
	currency: string
	callingCode: string
	region: string
	subregion: string
	slug: string
	name: {
		common: string
		ar: string
		de: string
		en: string
		es: string
		fr: string
		hi: string
		ja: string
		ko: string
		pt: string
		ru: string
		tr: string
		zh: string
	}
	countryCode: string | CountryCode | TGeneric
	visaCode: string
	states: string[]
}

export type PeriodSpanType = 'day' | 'week' | 'month' | 'year' | 'all'

export interface DialogProps {
	isOpen?: boolean
	setOpen?: any
	title?: string
	message?: string
	description?: any
	style?: any
	cta?: any
	variant?: 'success' | 'error' | 'warning' | 'info' | 'user'
}

export interface ActionSheetItemProps {
	title?: string
	subTitle?: string
	left?: string
	right?: string
	onPress?: TGeneric
	isLast?: any
}

export interface ActionSheetProps {
	isOpen?: boolean
	setOpen?: any
	title?: string
	actions?: ActionSheetItemProps[]
}

export interface PopupProps {
	isOpen?: boolean
	setOpen?: any
	title?: string
	message?: string
	description?: any
	style?: any
	cta?: any
	variant?: 'success' | 'error' | 'warning' | 'info' | 'user'
}

export type TenantFirebasePlatformConfig = {
	appId?: string
}

export type TenantFirebaseConfig = {
	apiKey?: string
	authDomain?: string
	projectId?: string
	storageBucket?: string
	messagingSenderId?: string
	measurementId?: string
	ios?: TenantFirebasePlatformConfig
	android?: TenantFirebasePlatformConfig
	web?: TenantFirebasePlatformConfig
}

export interface TenantSentryConfig {
	project: string
	org: string
	url: string
}

export interface TenantSocialConfig {
	twitter: string | null
	facebook: string | null
	instagram: string | null
	linkedin: string | null
	youtube: string | null
	tiktok: string | null
}

export interface TenantAppStoreUrlConfig {
	android: string
	ios: string
	apk: string
}

export type UserEntityTrivialRole = string

export type UserAccountGroupRole = {
	name: string
	label: string
	order: number
	public: boolean
	symbol: string
	assignable: boolean
	description: string
	kyc_blocking: boolean
	kyc_required: boolean
	kyc_blocking_scope: string
}

export type UserAccountGroupRoles = Record<string, UserAccountGroupRole>

export type SystemRole = {
	name: string
	label: string
	order: number
	public: boolean
	auto_assign: boolean
	description: string
	symbol?: string
	kyc_blocking?: boolean
	kyc_required?: boolean
	kyc_blocking_scope?: string
}

export type SystemRoles = Record<string, SystemRole>

export type KycRequiredDocKey = 'id' | 'drivers_license' | 'practice_license' | 'proof_of_address' | 'live_photo'

export type KycProfileRuleKind = 'identity_document' | 'license_document' | 'liveness_photo' | 'proof_of_address'

export type KycProfileImageKey =
	| 'front'
	| 'back'
	| 'document'
	| 'auto'
	| 'look_front'
	| 'look_left'
	| 'look_up_right'
	| 'look_up_left'
	| 'look_bottom_right'
	| 'look_bottom_left'

export type KycProfileRule = {
	kind: KycProfileRuleKind
	document_type: string
	required: boolean
	min_count: number
	expiry_required: boolean
	reference_image_keys: KycProfileImageKey[]
}

export type KycProfileConfig = {
	role_definitions?: Record<string, TenantRoleDefinition>
	target_user_roles?: string[]
	blocking?: boolean
	blocking_scope?: string
	is_active?: boolean
	rules: KycProfileRule[]
}

export type TenantRoleDefinition = {
	name: string
	description: string
}

export type TenantRoleDefinitions = Record<string, TenantRoleDefinition>

export interface PreauthHeadlineConfig {
	title: string
	highlight?: string
}

export interface TenantConfig {
	project_name: string
	project_slug: string
	project_domain: string
	project_description: string
	project_identifier: string
	project_owner: string
	project_eas_id: string
	project_scheme: string
	brand_color: string
	brand_color_accent: string
	brand_icon_background: string
	domain_api: string
	domain: string
	domain_static: string
	host: string
	associatedDomains: string[]
	sentry_config: TenantSentryConfig
	firebase_config: TenantFirebaseConfig
	service: string[]
	category: string
	social: TenantSocialConfig
	app_store_url: TenantAppStoreUrlConfig
	bootstrap_key?: string
	kyc_profile?: KycProfileConfig
	allowed_user_roles?: string[]
	role_definitions?: TenantRoleDefinitions
	user_account_group_roles?: UserAccountGroupRoles
	user_account_group_roles_require_input?: boolean
	preauth_headline?: PreauthHeadlineConfig
	system_roles?: SystemRoles
	backend_public_api_key?: string
	/** Public Parse application id. This is an SDK identifier, never a secret. */
	parse_application_id?: string
	/** Public Parse client key sent as `X-Parse-Client-Key` for Parse Server client-key enforcement. */
	parse_client_key?: string
	/** Mobile-reachable Parse Server URL, including the `/api` mount. */
	parse_server_url?: string
	/** Public origin hosting backend auth and other server-rendered journeys. */
	backend_origin?: string
	/**
	 * Native social sign-in client ids (public identifiers, not secrets), filled per tenant from
	 * the provider-console work recorded in `.project/spec/002-auth-google-apple/console-setup.md`. Empty
	 * values leave Google undeclared to the auth SPA. Apple needs no entry — its audience is
	 * `project_identifier`.
	 */
	auth_social?: {
		google_web_client_id?: string
		google_ios_client_id?: string
		google_ios_url_scheme?: string
	}
}

export interface TenantRuntimeExtra extends Omit<TenantConfig, 'sentry_config'> {
	name?: string
	slug?: string
	appName?: string
	version?: string
	eas?: {
		projectId?: string
	}
	sentry_config?: TenantSentryConfig & {
		dsn?: string
		dns?: string
	}
	[key: string]: unknown
}
