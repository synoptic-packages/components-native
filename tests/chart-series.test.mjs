import assert from 'node:assert/strict'
import test from 'node:test'

/**
 * The series model behind the shared `ChartLine` / `ChartSparkline` pair.
 *
 * Two of these decisions are the ones that go wrong silently, and both were already load-bearing in
 * `PriceChart` before the chart became a shared component.
 *
 * ORDER. `assets_history` is a descending query, so its newest row is first. Drawing it unreversed
 * renders every movement backwards — a rising asset falls — and nothing in the type system, the
 * runtime or a screenshot review catches it unless the reader already knows which way the price went.
 * The order is therefore a declared property of the series, not something a caller remembers to do.
 *
 * MINIMUM. Two points is the least that can honestly be called a line; one is a dot and none is
 * nothing. A chart is a claim about what a value did, so a single point must produce an empty state
 * rather than a flat line the viewer reads as "it did not move".
 */
import { chartLineColor } from '../src/components/chart/src/color.ts'
import { CHART_MINIMUM_POINTS, chartHasLine, chartPoints, chartValueRange } from '../src/components/chart/src/series.ts'

const colors = { primary: '#111111', accent: '#222222', muted: '#333333' }

test('a series is drawn oldest to newest, whatever order it arrives in', () => {
	assert.deepEqual(chartPoints([1, 2, 3], { order: 'oldest-first' }), [{ value: 1 }, { value: 2 }, { value: 3 }])

	assert.deepEqual(chartPoints([3, 2, 1], { order: 'newest-first' }), [{ value: 1 }, { value: 2 }, { value: 3 }])
})

test('oldest-first is the default, so an undeclared order never reverses a series', () => {
	assert.deepEqual(chartPoints([1, 2, 3]), [{ value: 1 }, { value: 2 }, { value: 3 }])
})

test('values that cannot be plotted are dropped rather than plotted as zero', () => {
	assert.deepEqual(chartPoints([1, Number.NaN, 2, Number.POSITIVE_INFINITY, 3]), [
		{ value: 1 },
		{ value: 2 },
		{ value: 3 },
	])
})

test('numeric strings from a backend integer field are accepted', () => {
	assert.deepEqual(chartPoints(['1', '2', '3']), [{ value: 1 }, { value: 2 }, { value: 3 }])
	assert.deepEqual(chartPoints(['', 'abc', null, undefined, 4]), [{ value: 4 }])
})

test('a limit keeps the most recent points, never the first ones', () => {
	assert.deepEqual(chartPoints([1, 2, 3, 4, 5], { limit: 3 }), [{ value: 3 }, { value: 4 }, { value: 5 }])

	// Reversal happens before the cut, so a newest-first feed still yields its newest points.
	assert.deepEqual(chartPoints([5, 4, 3, 2, 1], { order: 'newest-first', limit: 3 }), [
		{ value: 3 },
		{ value: 4 },
		{ value: 5 },
	])
})

test('a limit is applied after unplottable values are dropped, so it is a count of drawn points', () => {
	assert.deepEqual(chartPoints([1, Number.NaN, 2, 3], { limit: 2 }), [{ value: 2 }, { value: 3 }])
})

test('a non-positive limit is ignored rather than emptying the series', () => {
	assert.deepEqual(chartPoints([1, 2, 3], { limit: 0 }), [{ value: 1 }, { value: 2 }, { value: 3 }])
	assert.deepEqual(chartPoints([1, 2, 3], { limit: -5 }), [{ value: 1 }, { value: 2 }, { value: 3 }])
})

test('two points is the minimum that can honestly be called a line', () => {
	assert.equal(CHART_MINIMUM_POINTS, 2)
	assert.equal(chartHasLine([]), false)
	assert.equal(chartHasLine([{ value: 1 }]), false)
	assert.equal(chartHasLine([{ value: 1 }, { value: 2 }]), true)
})

test('the range reports the drawn extent, and reports nothing for an undrawable series', () => {
	assert.deepEqual(chartValueRange([{ value: 3 }, { value: 1 }, { value: 2 }]), { min: 1, max: 3 })
	assert.equal(chartValueRange([]), null)
})

test('a flat series has a range with equal bounds rather than a null one', () => {
	assert.deepEqual(chartValueRange([{ value: 2 }, { value: 2 }]), { min: 2, max: 2 })
})

test('a semantic token names the line colour and resolves against the active theme', () => {
	assert.equal(chartLineColor('accent', colors), '#222222')
})

test('a colour the backend supplied as data is drawn as given', () => {
	assert.equal(chartLineColor('#F5B301', colors), '#F5B301')
	assert.equal(chartLineColor('#fa0', colors), '#fa0')
	assert.equal(chartLineColor('  #F5B301  ', colors), '#F5B301')
})

test('every hex form React Native accepts is accepted here', () => {
	assert.equal(chartLineColor('#fa0f', colors), '#fa0f')
	assert.equal(chartLineColor('#F5B301CC', colors), '#F5B301CC')
})

test('an absent or unusable colour falls back to primary rather than reaching the renderer', () => {
	assert.equal(chartLineColor(undefined, colors), '#111111')
	assert.equal(chartLineColor('', colors), '#111111')
	assert.equal(chartLineColor('#F5B30', colors), '#111111')
	assert.equal(chartLineColor('not-a-colour', colors), '#111111')
})
