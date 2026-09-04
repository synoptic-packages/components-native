/**
 * Localised list-empty copy.
 *
 * Adapted from the mobile app's `src/i18n/en.ts` + `list/src/Component.empty.tsx`: the original
 * imported the whole app i18n bundle for one lookup (`en.className[<class>].plural`). This package is
 * self-contained, so the same plural map is carried here directly. Hosts can pass their own `title`/
 * `description` to override.
 */
export const classNamePlurals: Record<string, { singular: string; plural: string }> = {
	crypto: { singular: 'Crypto', plural: 'Crypto' },
	creditCard: { singular: 'Payment card', plural: 'Payment cards' },
	bankAccount: { singular: 'Bank account', plural: 'Bank accounts' },
	files: { singular: 'Media', plural: 'Media' },
	contact: { singular: 'Contact', plural: 'Contacts' },
	notification: { singular: 'Notification', plural: 'Notifications' },
	widget: { singular: 'Widget', plural: 'Widgets' },
	transaction: { singular: 'Transaction', plural: 'Transactions' },
	activity: { singular: 'Activity', plural: 'Activity' },
	address: { singular: 'Address', plural: 'Addresses' },
}

export const pluralForClassName = (className?: string): string =>
	(className && classNamePlurals[className]?.plural) || 'items'
