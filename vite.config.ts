import {defineConfig} from 'vite-plus';

export default defineConfig({
	base: './',
	fmt: {
		arrowParens: 'avoid',
		bracketSpacing: false,
		singleQuote: true,
		useTabs: true,
	},
	logLevel: 'silent',
	pack: {
		clean: false,
		deps: {
			resolveDepSubpath: true,
		},
		dts: {
			generator: 'oxc',
		},
		entry: ['./src/**/*.ts'],
		unbundle: true,
	},
	test: {
		coverage: {
			include: ['src/**/*.ts'],
			provider: 'istanbul',
		},
		environment: 'jsdom',
		watch: false,
	},
});
