import { FnArgs, MontaPlugin, Node } from '../..';

export default function(plugin : MontaPlugin) : void {

	/**
	 * Helper to ease repetition, since all these functions
	 * are essentially the same but with a different check
	 */
	const register = (name : string, check : (a : any, b : any) => boolean) : void => {
		const config = { requiredArgs: 1, maxArgs: 2, blockRequired: true, elseBlock: true };
		plugin.registerPre(name, args => wrap(name, args, check), config);
	};

	register('eq', (a, b) => a === b);
	register('neq', (a, b) => a !== b);
	register('lt', (a, b) => a < b);
	register('gt', (a, b) => a > b);

	register('has', (a, b) => {
		if (typeof a !== 'object') throw new Error(`Cannot call 'has()' on primitive value '${ a }'`);

		if (Array.isArray(a)) return a.includes(b);
		return Object.prototype.hasOwnProperty.call(a, b);
	});
}

/**
 * Wraps a control flow function (DRY)
 */
function wrap(name : string, { args, input, block, elseBlock } : FnArgs, check : (a : any, b : any) => boolean) : Node[] {
	if (!block) throw new Error(`Expected block after '${ name }()' call`);

	const a = input ? input.value : args[0].value;
	const b = input ? args[0].value : args[1].value;

	if (check(a, b)) return block;
	if (elseBlock) return elseBlock;
	return [];
}
