import CleanCSS from 'clean-css';
import Terser from 'terser';

import { FnArgs } from 'monta';

import { Resource } from '../Resource';
import { ResourcePlugin } from '../Options';
import { PassThrough } from 'stream';

export default async function toUrl(this : ResourcePlugin, { input } : FnArgs) : Promise<Resource[]> {
	if (!input) throw new Error('Resource is undefined');

	const resources = input.value as Resource[];

	const output = resources.map(async resource => {
		const stream = new PassThrough();
		const res = new Resource(resource.file, stream);

		const data = (await resource.collect()).toString();

		switch (resource.ext) {
			case 'css':
				stream.push(await minifyCss(data));
				break;

			case 'js':
				stream.push(await minifyJs(resource, data));
				break;

			default:
				throw new Error(`Cannot minify file type '${ resource.ext }'`);
		}

		stream.end();
		return res;
	});

	return Promise.all(output);
}

async function minifyCss(css : string) : Promise<string> {
	const cleaner = new CleanCSS({ level: 2, returnPromise: true });
	const minified = await cleaner.minify(css);

	if (minified.errors.length > 0) {
		throw minified.errors;
	}

	return minified.styles;
}

async function minifyJs(source : Resource, js : string) : Promise<string> {
	const minified = Terser.minify({
		[source.file]: js,
	}, {
		compress: {
			hoist_funs: true, // eslint-disable-line @typescript-eslint/camelcase
			inline: true,
			passes: 2,
		}
	});

	if (minified.error) {
		throw minified.error;
	}

	if (!minified.code) {
		throw minified.warnings;
	}

	return minified.code;
}
