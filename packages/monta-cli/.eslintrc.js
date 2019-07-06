const path = require('path');
const base = require('../../.eslintrc.js');

module.exports = {
	...base,

	parserOptions: {
		...base.parserOptions,

		tsconfigRootDir: __dirname,
		project: path.join(__dirname, 'tsconfig.json'),
	}
};
