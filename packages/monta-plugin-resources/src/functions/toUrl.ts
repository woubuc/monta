import { FnArgs } from 'monta';

import { Resource } from '../Resource';
import { ResourcePlugin } from '../Options';

export default async function toUrl(this : ResourcePlugin, { input } : FnArgs) : Promise<string[]> {
	if (!input) throw new Error('Resource is undefined');

	const resources = input.value as Resource[];

	const output = resources.map(resource => {
		const { publicDir, baseUrl } = this.pluginOptions;
		return resource.save(publicDir, baseUrl);
	});

	return Promise.all(output);
}
