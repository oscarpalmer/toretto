import {globSync} from 'tinyglobby';

const dirname = new URL('.', import.meta.url).pathname;

const compilationOptions = {
	preferredConfigPath: `${dirname}/tsconfig.json`,
};

const entries = globSync('./src/index.ts').map(file => ({
	filePath: `${dirname}/${file}`,
	libraries: {
		inlinedLibraries: ['@oscarpalmer/atoms'],
	},
	noCheck: true,
	outFile: `${dirname}/types/${file.replace('src/', '').replace('.ts', '.d.ts')}`,
}));

export {compilationOptions, entries};