import { MontaPlugin } from '../index';
import { Context, Node } from '../..';
import { NodeType } from '../../parser/Parser';
import { FnInput } from '../Fn';

function foreach(array : FnInput, ctx : Context, block ?: Node[]) : Node[] {
	if (!block) throw new Error('Expected block in `foreach`');
	if (!Array.isArray(array.value)) throw new Error('Expected data in `foreach` to be array');

	const output : Node[] = [];

	for(const val of array.value) {
		const subContext = ctx.getCustomContext(val);
		output.push({
			type: NodeType.ScopedGroup,
			ctx: subContext,
			children: block,
		});
	}

	return output;
}

export default function(plugin : MontaPlugin) : void {

	plugin.registerPre('foreach',
		({ args, input, ctx, block }) => foreach(input || args[0], ctx, block),
		{ pipeable: true, requiredArgs: 1 });

}
