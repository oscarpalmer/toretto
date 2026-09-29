import {defineConfig} from 'vite-plus/pack';

export default defineConfig({
	clean: false,
	deps: {
		// tsdown <0.23 compatibility: resolve external dependency subpaths.
		// Remove to preserve subpath imports as written (the new default).
		// https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
		resolveDepSubpath: true,
		alwaysBundle: /^@oscarpalmer/,
	},
	entry: './src/index.ts',
	minify: 'dce-only',
});
