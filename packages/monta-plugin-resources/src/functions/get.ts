import path from 'path';
import { pathExists } from 'fs-extra';

import { FnArgs } from 'monta';

import { Res, Resource } from '../Resource';
import { ResourcePlugin } from '../Options';

export default async function(this : ResourcePlugin, { input, args, ctx } : FnArgs) : Promise<Resource> {
	const filename = path.resolve(this.options.templateRoot, input ? input.value : args[0].value);

	if (!await pathExists(filename)) {
		throw new Error('File ' + filename + ' not found');
	}

	return new Res(ctx, filename);
}
