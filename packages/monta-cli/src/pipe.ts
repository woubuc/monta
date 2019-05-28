export function collectPipedInput() : Promise<string> {
	if (process.stdin.isTTY) return Promise.resolve('');

	return new Promise(resolve => {
		const data : string[] = [];

		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		process.stdin.on('data', chunk => data.push(chunk.toString()));
		process.stdin.on('end', () => resolve(data.join('')));
	});
}
