import { FnArgs } from 'monta';

import { Resource } from '../Resource';
import { ResourcePlugin } from '../Options';

export default async function toUrl(this : ResourcePlugin, { input } : FnArgs) : Promise<string> {
	if (!input) throw new Error('Resource is undefined');

	const resource = input.value as Resource;

	const { publicDir, baseUrl } = this.pluginOptions;
	return resource.save(publicDir, baseUrl);
}
