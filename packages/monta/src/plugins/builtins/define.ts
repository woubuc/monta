import { FnArgs, MontaPlugin, Node } from '../../';
import { FnInput } from '../Fn';

/* The define() and block() functions allow the user to
 * define content blocks in a base template and add
 * content to those blocks in sub-templates (or simply
 * other places in the same template, although that
 * is a less frequent use case).
 *
 * Define a block:
 * `${ define('blockName') }`
 *
 * Define a block with default content:
 * `${ define('blockName'): }default content${ :end }`
 *
 * Set the content for a block:
 * `${ block('blockName'): }my block content${ :end }`
 */

export default function(plugin : MontaPlugin) : void {

	/* The define function is called twice. First in the
	 * `pre` step, where it initialises the block, and
	 * then again in the `post` step, where it replaces
	 * the default content with the content set through
	 * the `block()` function.
	 */

	plugin.registerPre('define', definePre, { requiredArgs: 1, block: true });
	plugin.registerPost('define', definePost, { requiredArgs: 1 });

	plugin.registerFn('block', blockFn, { pipeable: false, requiredArgs: 1, block: true });
}

/**
 * Formats the context data key, so all functions use the same key
 */
const getKey = (name : string) : string => `define:block:${ name }`;

/**
 * Gets the block name from the function args
 */
const getName = (args : FnInput[]) : string => {
	if (args.length === 0) throw new Error('Cannot define block without name');
	return args[0].value;
};

/**
 * The `define` pre-function. Initialises the block
 * in the context data. Uninitialised blocks cannot
 * receive content.
 */
function definePre({ args, block, ctx, node } : FnArgs) : Node[] {
	const name = getName(args);
	const defaultContent = block || [];

	if (!ctx.hasData(getKey(name))) {
		ctx.setData(getKey(name), defaultContent);
	}

	return [node];
}

/**
 * The `define` post-function. At this point, all
 * blocks should have received content, so now we
 * replace the `define` function call with the
 * registered content.
 */
function definePost({ args, ctx } : FnArgs) : Node[] {
	const name = getName(args);
	const data = ctx.getData<Node[]>(getKey(name));

	if (!data) return [];
	return data;
}

/**
 * The `block` function. Will set the content of an
 * already defined block.
 */
function blockFn({ args, block, ctx } : FnArgs) : Node[] {
	const name = getName(args);

	if (!ctx.hasData(getKey(name))) throw new Error(`Cannot set content for undefined block '${ name }`);
	ctx.setData(getKey(name), block);

	return [];
}
