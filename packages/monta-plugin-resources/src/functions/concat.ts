import { FnArgs } from 'monta';

import { Resource } from '../Resource';
import { ResourcePlugin } from '../Options';
import { PassThrough } from 'stream';
import { awaitEvt } from '../utils/streamUtils';

export default async function concat(this : ResourcePlugin, { input, args } : FnArgs) : Promise<Resource[]> {
	if (!input) throw new Error('Resource is undefined');
	if (args.length < 1) throw new Error(`Missing argument in 'concat()'`);

	const filename = args[0].value.toString();
	const resources = input.value as Resource[];

	const stream = new PassThrough();
	const data = new Resource(filename, stream);

	for (const resource of resources) {
		const resourceStream = resource.toStream();
		resourceStream.pipe(stream, { end: false });
		await awaitEvt(resourceStream, 'end');
	}
	stream.end();

	return [data];
}
