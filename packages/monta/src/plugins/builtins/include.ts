import { MontaPlugin } from '../index';
import path from "path";
import { parseFile } from '../../parser';
import { Context, Node } from '../../';

export default function(plugin : MontaPlugin<unknown>) : void {

	plugin.registerPre('include',
		({ args, ctx }) => include(args[0].value, ctx),
		{ pipeable: false, requiredArgs: 1 });

}

function include(fileName : string, ctx : Context) : Promise<Node[]> {
	const filePath = path.resolve(ctx.options.templateRoot, ctx.meta.path, fileName);
	return parseFile(ctx.options.templateRoot, filePath);
}
