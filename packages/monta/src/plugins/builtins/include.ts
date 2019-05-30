import { MontaPlugin } from '../index';
import path from "path";
import { parseFile } from '../../parser';
import { Context, Node } from '../../';

function include(fileName : string, ctx : Context) : Promise<Node[]> {
	const filePath = path.resolve(ctx.meta.path, fileName);
	return parseFile(filePath);
}

export default function(plugin : MontaPlugin) {

	plugin.registerPre('include',
		({ args, ctx }) => include(args[0], ctx),
		{ requiredArgs: 1 });

}
