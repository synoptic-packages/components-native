import { defineConfig } from 'tsup'
import { readFileSync } from 'fs'

// All peer/dev deps are external — consumers bring their own RN + expo stack.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const external = [
	...Object.keys(pkg.peerDependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
	/^(react-native|@react-native|expo|@expo|@gorhom|moti|@synotech)\/[^/]+/,
]

export default defineConfig([
	{
		entry: ['src/index.ts'],
		outDir: 'dist/esm',
		format: ['esm'],
		dts: false,
		clean: true,
		sourcemap: true,
		target: 'es2020',
		external,
		loader: {
			'.json': 'json',
		},
	},
	{
		entry: ['src/index.ts'],
		outDir: 'dist/commonjs',
		format: ['cjs'],
		dts: false,
		clean: true,
		sourcemap: true,
		target: 'es2020',
		external,
		loader: {
			'.json': 'json',
		},
	},
	{
		entry: ['src/index.ts'],
		outDir: 'dist/types',
		dts: { only: true },
		clean: true,
		external,
	},
])
