/// <reference types="vitest" />
import {extname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {globSync} from 'glob';
import {defineConfig} from 'vite';

const watch = process.argv.includes('--watch');

const files = globSync(watch ? './src/index.ts' : './src/**/*.ts').map(file => [
	relative('./src', file.slice(0, file.length - extname(file).length)),
	fileURLToPath(new URL(file, import.meta.url)),
]);

export default defineConfig({
	base: './',
	build: {
		lib: {
			entry: [],
			formats: ['cjs', 'es'],
		},
		minify: false,
		outDir: './dist',
		rollupOptions: {
			external: [
				'@oscarpalmer/atoms/function',
				'@oscarpalmer/atoms/is',
				'@oscarpalmer/atoms/string',
			],
			input: Object.fromEntries(files),
			output: {
				generatedCode: 'es2015',
				preserveModules: true,
			},
		},
	},
	logLevel: 'silent',
	test: {
		coverage: {
			include: ['src/**/*.ts'],
			provider: 'istanbul',
		},
		environment: 'jsdom',
		watch: false,
	},
});
