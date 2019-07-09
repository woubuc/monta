import globby from 'globby';

import { FnArgs } from 'monta';

import { Res, Resource } from '../Resource';
import { ResourcePlugin } from '../Options';

export default async function(this : ResourcePlugin, { input, args, ctx } : FnArgs) : Promise<Resource[]> {
	const pattern = input ? input.value : args[0].value;
	const cwd = ctx.getPath().replace(/\\/g, '/');

	const paths = await globby([pattern], { cwd, onlyFiles: true, unique: true });

	if (paths.length === 0) {
		throw new Error(`No files found that match '${ pattern }' in ${ cwd }`);
	}

	// Fast-glob (and by extension globby) return the found files
	// in arbitrary order. This means we need to sort the array
	// before returning it, so we can guarantee that the same glob
	// on the same file structure will always return the same array.
	paths.sort();

	return paths.map(path => new Res(ctx, path));
}
