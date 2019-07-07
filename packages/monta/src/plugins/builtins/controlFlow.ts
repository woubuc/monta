import { FnArgs, MontaPlugin, Node } from '../..';

export default function(plugin : MontaPlugin) : void {

	const register = (name : string, check : (a : any, b : any) => boolean) : void => {
		plugin.registerPre(name,
			args => wrap(name, args, check),
			{ requiredArgs: 1, maxArgs: 2, block: true, elseBlock: true });
	};

	register('eq', (a, b) => a === b);
	register('neq', (a, b) => a !== b);
	register('lt', (a, b) => a < b);
	register('gt', (a, b) => a > b);

	register('has', has);
}

function wrap(name : string, { args, input, block, elseBlock } : FnArgs, check : (a : any, b : any) => boolean) : Node[] {
	if (!block) throw new Error(`Expected block after '${ name }()' call`);

	const a = input ? input.value : args[0].value;
	const b = input ? args[0].value : args[1].value;

	if (check(a, b)) return block;
	if (elseBlock) return elseBlock;
	return [];
}

function has(a : any, b : any) : boolean {
	if (typeof a !== 'object') throw new Error(`Cannot call 'has()' on primitive value '${ a }'`);

	if (Array.isArray(a)) {
		return a.includes(b);
	}

	return Object.prototype.hasOwnProperty.call(a, b);
}
