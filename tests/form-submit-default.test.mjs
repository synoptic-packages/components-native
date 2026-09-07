import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

/**
 * The shared Form's submit label defaults to "Submit". The standard has to
 * survive as the DEFAULT, not only as a convention every caller remembers.
 * (Moved with the component from ventry mobile, whose app-side suite keeps
 * guarding caller labels.)
 */
const here = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(here, '..', 'src', 'components', 'form', 'src', 'Component.tsx'), 'utf8')

test('the shared Form still defaults its submit label to "Submit"', () => {
	assert.match(source, /submitLabel = [`'"]Submit[`'"]/)
})
