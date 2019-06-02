#!/usr/bin/env node

import chalk from 'chalk';

import { collectPipedInput } from './pipe';
import { cli } from './cli';

console.log(chalk.bold('Monta CLI') + ' v' + require('../package.json').version); // eslint-disable-line no-console
collectPipedInput().then(input => {
	const data = (input.length === 0) ? {} : JSON.parse(input);

	// noinspection JSIgnoredPromiseFromCall
	cli(data, process.argv.slice(2));
});
