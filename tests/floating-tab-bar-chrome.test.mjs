import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

/**
 * The floating pill's chrome, as spec 049 items 4–5 landed it.
 *
 * Item 4: the pill disappeared against matching surfaces (owner screenshot: carousel tiles behind
 * it), so it carries a scheme-picked border — `divider` in light mode, the tenant's `accent` in
 * dark. Item 5: inactive glyphs draw full `text`, so focus is the `accent` dot alone (plus `filled`
 * where the glyph has a closed form — 0163). Both are guarded as SOURCE SHAPE because neither is
 * assertable from a Maestro flow: a color is not an id, and the regression would come back exactly
 * as a reintroduced `muted` tint or a deleted border prop, with nothing else failing.
 */
const here = dirname(fileURLToPath(import.meta.url))
const componentPath = join(here, '..', 'src', 'components', 'floating-tab-bar', 'src', 'Component.tsx')
const stylesPath = join(here, '..', 'src', 'components', 'floating-tab-bar', 'src', 'styles.ts')
const component = readFileSync(componentPath, 'utf8')
const stylesSource = readFileSync(stylesPath, 'utf8')

test('the pill draws a scheme-picked token border', () => {
	assert.match(
		component,
		/borderWidth=\{1\}/,
		'the pill View declares borderWidth={1} inline (the shared View passes border* props through)'
	)
	assert.match(
		component,
		/borderColor=\{isDark \? `accent` : `divider`\}/,
		'the border color is the divider token in light mode and the accent token in dark — tokens only, branched on useTheme isDark'
	)
})

test('no glyph is muted — focus is the dot, never the tint', () => {
	// 049 item 5 stated as an absence: the word does not appear in the component at all, so a
	// reintroduced `colors.muted` tint (or a docstring re-teaching it) fails here by name.
	assert.ok(!component.includes('muted'), 'the component neither tints with nor documents a muted state')
})

test('styles.ts stays shadows-only', () => {
	// The border lives on the inline-prop seam the repo rule prefers; a border migrating into the
	// stylesheet is the shape a second, conflicting declaration would take.
	assert.ok(!stylesSource.includes('border'), 'no border declarations in the shadow stylesheet')
})
