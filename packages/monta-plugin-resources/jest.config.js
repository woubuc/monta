const base = require('../../jest.config.base.js');

module.exports = {
	...base,
	rootDir: __dirname,
	testPathIgnorePatterns: ['/node_modules/', '_utils.ts'],
};
