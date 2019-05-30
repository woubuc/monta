import { Context, MontaPlugin, Node } from '../../';

function definePre(name : string, node : Node, defaultBlock : Node[], ctx : Context) : Node[] {
	ctx.setData('define:block:' + name, defaultBlock);
	return [node];
}

function definePost(name : string, ctx : Context) : Node[] {
	const data = ctx.getData<Node[]>('define:block:' + name);
	if (!data) return [];
	return data;
}

function blockFn(name : string, block : Node[], ctx : Context) : Node[] {
	ctx.setData('define:block:' + name, block);
	return [];
}

export default function(plugin : MontaPlugin) {

	plugin.registerPre('define',
		({ node, ctx, args, block }) => definePre(args[0], node, block || [], ctx),
		{ requiredArgs: 1 });

	plugin.registerPost('define',
		({ ctx, args }) => definePost(args[0], ctx),
		{ requiredArgs: 1 });

	plugin.registerFn('block',
		({ ctx, args, block }) => blockFn(args[0], block as Node[], ctx),
		{ requiredArgs: 1, block: true });

}
