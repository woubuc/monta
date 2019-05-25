import { Node, NodeType } from './parser/Parser';
import { Iterator } from './util/Iterator';
import Context from './Context';

export async function render(nodes : Node[], ctx : Context, after : boolean = false) : Promise<string> {
	const source = new Iterator(nodes);
	const output : (string | Node)[] = [];

	while (source.hasNext()) {
		const node = source.next();

		switch (node.type) {
			case NodeType.TemplateOutput:
				if (!node.params) continue;

				for (const param of node.params) {
					if (param.type === NodeType.LiteralValue) {
						if (!param.value) throw new Error('Param has no value');
						output.push(param.value.value);
						continue;
					}

					if (param.type === NodeType.Variable) {
						if (!param.value) throw new Error('Param has no value');
						const value = ctx.getValue<string>(param.value.value);

						if (!value) output.push('undefined');
						else output.push(value.toString());
						continue;
					}

					console.log('Unknown output param:', param);
				}
				break;

			case NodeType.TokenGroup:
				console.log('Unknown token group:', node);
				break;

			case NodeType.Function:
				if (!node.value) throw new Error('Function has no name');

				const fn = ctx.getFunction(node.value.value);
				if (!fn) {
					console.warn('Unknown function `' + node.value.value + '`');
					continue;
				}

				const params : any[] = [];
				if (node.params) {
					for (const param of node.params) {
						if (!param.value) continue;
						if (param.type === NodeType.LiteralValue) {
							params.push(param.value.value);
						}
					}
				}

				if (!after) {
					if (fn.before) await fn.before(ctx, params);

					if (fn.runAfter) {
						output.push(node);
						continue;
					}
				}

				const fnResult = await fn.exec(ctx, params, node.children, node.elseChildren);
				output.push(fnResult.toString());
				break;

			case NodeType.Expression:
				console.warn('Operator expressions not implemented yet (on line: ' + (node.params ? node.params.map(p => p.value ? p.value.value : '') : []).join(' ') + ')'); // TODO implement expressions
				break;

			default:
				console.error('Unhandled node:', node);
		}
	}

	if (after) return cleanup(output.join(''));

	const results = await Promise.all(
		output.map(async (chunk) => {
			if (typeof chunk === 'string') return chunk;
			return render([chunk], ctx, true);
		})
	);
	return cleanup(results.join(''));
}

function cleanup(output : string) : string {
	return output.trim()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.filter(line => line.trim().length > 0)
		.join('\n');
}
