import {defineConfig} from 'tsdown';

export default defineConfig({
	clean: false,
	deps: {
		alwaysBundle: /^@oscarpalmer/,
	},
	entry: './src/index.ts',
	minify: 'dce-only',
});
