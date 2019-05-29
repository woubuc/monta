module.exports = {
	preset: 'ts-jest',

	verbose: true,

	testEnvironment: 'node',
	testMatch: ['**/packages/*/tests/**/*.ts'],

	coverageDirectory: './coverage/',

	moduleNameMapper: {
		'^monta$': '<rootDir>/../monta/src',
		'^(monta(-.*)?)$': '<rootDir>/../$1/src/',
	},
};
