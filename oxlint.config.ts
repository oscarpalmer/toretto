import {defineConfig} from 'oxlint';
import rules from './node_modules/@oscarpalmer/atoms/plugin/index.js';

export default defineConfig({
	jsPlugins: ['./plugin/index.js'],
	rules: {
		...rules,
	},
});
