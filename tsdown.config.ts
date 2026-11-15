import {defineConfig} from 'vite-plus/pack';

export default defineConfig({
	clean: false,
	copy: [
		{
			from: './dist/index.mjs',
			to: './dist',
			rename: 'toretto.full.mjs',
		},
	],
	deps: {
		resolveDepSubpath: true,
		alwaysBundle: /^@oscarpalmer/,
	},
	entry: './src/index.ts',
	minify: 'dce-only',
});
