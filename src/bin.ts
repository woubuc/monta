#!/usr/bin/env node

import cli from './cli';

function collectInput() : Promise<string> {
	return new Promise(resolve => {
		const data : string[] = [];

		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		process.stdin.on('data', chunk => data.push(chunk.toString()));
		process.stdin.on('end', () => resolve(data.join('')));
	});
}

collectInput().then(input => {
	const data = (input.length === 0) ? {} : JSON.parse(input);

	// noinspection JSIgnoredPromiseFromCall
	cli(data, process.argv.slice(2));
});
