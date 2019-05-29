module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/packages/*/tests/**/*.ts'],

	moduleNameMapper: {
		'^(monta(-.*)?)$': '<rootDir>/../$1/src/',
	},
};
