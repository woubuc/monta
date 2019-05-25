import path from 'path';
import Context from '../Context';
import { render } from '../render';
import { parseFile } from '../parser';

export default {
	name: 'include',

	async exec(ctx : Context, params : any[]) : Promise<string> {
		if (typeof params[0] !== 'string') {
			throw new Error('Expected argument for `include()` to be string, found ' + typeof params[0]);
		}

		const filePath = path.join(ctx.meta.path, params[0]);
		const nodes = await parseFile(filePath);

		return render(nodes, ctx.getSubContext(params.length >= 2 ? params[1] : '.'));
	}
}
