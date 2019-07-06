module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	env: {
		node: true,
		es6: true,
		jest: true,
	},
	rules: {
		'indent': 'off', // Superseded by TS plugin
		'curly': ['error', 'multi-line', 'consistent'],
		'no-dupe-class-members': 'off', // To allow TS method overloads
		'semi': 'off', // Superseded by TS plugin

		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/await-thenable': 'warn',
		'@typescript-eslint/ban-ts-ignore': 'warn',
		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
		'@typescript-eslint/no-for-in-array': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unnecessary-qualifier': 'warn',
		'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
		'@typescript-eslint/no-use-before-define': ['error', { functions: false }],
		'@typescript-eslint/prefer-for-of': 'warn',
		'@typescript-eslint/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
		'@typescript-eslint/type-annotation-spacing': ['error', { before: true, after: true }],
		'@typescript-eslint/unified-signatures': 'warn',
	},
};
