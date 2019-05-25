import { Node } from '../parser/Parser';
import Context from '../Context';
import { render } from '../render';

const DATA_KEY = 'define:blocks';
type Blocks = Map<string, string | null>;

export default [
	{
		name: 'block',

		async exec(ctx : Context, params : any[], block : Node[]) : Promise<string> {
			const name = params[0];
			if (name == undefined || typeof name !== 'string') {
				console.warn('Missing or invalid name for block');
				return '';
			}

			let blocks = ctx.getData<Blocks>(DATA_KEY);
			if (!blocks || !blocks.has(name)) {
				console.warn('Block `' + name + '` is not defined');
				return '';
			}

			const rendered = await render(block, ctx.getSubContext());

			blocks.set(name, rendered);
			ctx.setData(DATA_KEY, blocks);

			return '';
		},
	},

	{
		name: 'define',
		runAfter: true,

		async before(ctx : Context, params : any[]) : Promise<void> {
			const name = params[0];
			if (name == undefined || typeof name !== 'string') {
				console.warn('Missing or invalid name for define block');
				return;
			}

			let blocks = ctx.getData<Blocks>(DATA_KEY);
			if (!blocks) blocks = new Map();

			if (blocks.has(name)) {
				console.warn('Cannot define multiple blocks with the same name `' + name + '`');
				return;
			}

			blocks.set(name, null);
			ctx.setData(DATA_KEY, blocks);
		},

		async exec(ctx : Context, params : any[], block : Node[]) : Promise<string> {
			const name = params[0];
			if (name == undefined || typeof name !== 'string') {
				console.warn('Missing or invalid name for define block');
				return '';
			}

			let blocks = ctx.getData<Blocks>(DATA_KEY);
			if (!blocks) throw new Error('Could not get blocks');

			const data = blocks.get(name);
			if (data) return data;

			if (block) return render(block, ctx);

			return '';
		}
	}
]
