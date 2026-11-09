const values = [
	undefined,
	null,
	true,
	123,
	123n,
	/regex/,
	'hello, world',
	[],
	{},
	new Map(),
	new Set(),
];

const {length} = values;

const miscFixture = {
	values,
	length,
};

export {miscFixture};
