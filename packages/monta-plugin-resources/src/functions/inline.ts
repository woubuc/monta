import { FnArgs } from 'monta';

import { Resource } from '../Resource';
import { ResourcePlugin } from '../Options';

const BINARY_TYPES : Readonly<Record<string, string>> = Object.freeze({
	bmp: 'image/bmp',
	png: 'image/png',
	gif: 'image/gif',
	webp: 'image/webp',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	ico: 'image/x-icon',

	eot: 'application/vnd.ms-fontobject',
	otf: 'font/otf',
	ttf: 'font/ttf',

	zip: 'application/zip',
});

export default async function inline(this : ResourcePlugin, { input } : FnArgs) : Promise<string[]> {
	if (!input) throw new Error('Resource is undefined');

	const resources = input.value as Resource[];

	const output = resources.map(async resource => {
		const data = await resource.collect();

		if (BINARY_TYPES[resource.ext]) {
			return `data:${ BINARY_TYPES[resource.ext] };base64,${ data.toString('base64') }`;
		}

		return data.toString();
	});

	return Promise.all(output);
}
