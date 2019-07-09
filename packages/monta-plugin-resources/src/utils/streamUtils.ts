import { PassThrough, Stream } from 'stream';

/**
 * Promisifies events
 */
export function awaitEvt(stream : Stream, evtName : string) : Promise<void> {
	return new Promise(resolve => stream.once(evtName, () => resolve()));
}

/**
 * Clones a single stream into two streams, both containing
 * the data of the original stream
 */
export function cloneStream(stream : Stream) : [Stream, Stream] {
	const a = new PassThrough();
	const b = new PassThrough();

	stream.on('data', chunk => {
		a.push(chunk);
		b.push(chunk);
	});

	stream.on('end', () => {
		a.push(null);
		b.push(null);
	});

	return [a, b];
}
