import { Node, NodeType } from './parser/Parser';
import { Iterator } from './util/Iterator';
import { Context } from './Context';
import { execFn, execPost, execPre, FnArgs, FnInput, hasFn, hasPost, hasPre } from './plugins/Fn';
import { Internal } from './Internal';

enum RenderStep { Pre, Fn, Post }

type Output = (string | number | boolean | Node)[];

export class Renderer {

	private output : Output = [];
	private currentRenderStepDone : boolean = true;

	public constructor(_ : Internal) {
	}

	public async render(nodes : Node[], ctx : Context) : Promise<string> {
		this.output = nodes;

		while (true) { // eslint-disable-line no-constant-condition
			this.output = await this.renderPass(this.output, RenderStep.Pre, ctx);
			if (!this.currentRenderStepDone) continue;

			this.output = await this.renderPass(this.output, RenderStep.Fn, ctx);
			if (!this.currentRenderStepDone) continue;

			this.output = await this.renderPass(this.output, RenderStep.Post, ctx);
			if (!this.currentRenderStepDone) continue;

			if (!this.output.every(c => typeof c === 'string')) continue;
			break;
		}

		return this.output
			.join('')
			.trim()
			.replace(/\r\n/g, '\n')
			.split('\n')
			.filter(line => line.trim().length > 0)
			.join('\n');
	}

	private async renderPass(nodes : Output, step : RenderStep, ctx : Context) : Promise<Output> {
		const output : Output = [];
		const push = (data : Output | string | Node) : void => {
			if (Array.isArray(data)) output.push(...data);
			else output.push(data);
		};

		const source = new Iterator(nodes);

		this.currentRenderStepDone = true;

		while (source.hasNext()) {
			const node = source.next();

			if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
				push(node.toString());
				continue;
			}

			if (!Node.isNode(node)) {
				push(node.toString());
				continue;
			}

			switch (node.type) {
				case NodeType.TemplateOutput: {
					if (!node.params) continue;

					for (const param of node.params) {
						const value = this.getValue(param, ctx);
						push(value);
					}
					break;
				}

				case NodeType.TokenGroup: {
					throw new Error('Unknown token group: ' + require('util').inspect(node) + ' (not yet implemented?)');
				}

				case NodeType.Function: {
					const result = await this.execFunction(step, node, ctx);
					if (result != null) push(result);
					break;
				}

				case NodeType.Expression: {
					throw new Error('Operator expressions not implemented yet (on line: ' + (node.params ? node.params.map(p => p.value ? p.value.value : '') : []).join(' ') + ')'); // TODO implement expressions
				}

				case NodeType.PipeSequence: {
					let lastValue : FnInput = { value: undefined };
					for (const next of node.params as Node[]) {

						if (next.type === NodeType.Variable) {
							if (!next.value) throw new Error('Variable node without value');
							lastValue.ident = next.value.value;
							lastValue.value = ctx.getValue(next.value.value);
							continue;
						}

						if (next.type === NodeType.LiteralValue) {
							lastValue.ident = undefined;
							lastValue.value = this.getValue(next, ctx);
							continue;
						}


						if (next.type === NodeType.Function) {
							const output = await this.execFunction(step, next, ctx, lastValue);
							if (output != null) {
								lastValue.ident = undefined;
								lastValue.value = output;
								this.currentRenderStepDone = false;
							}
							continue;
						}

						throw new Error('Unexpected node: ' + (node.value ? node.value.value : ''));
					}

					push(lastValue.value);

					break;
				}

				case NodeType.ScopedGroup:
					if (!node.ctx) throw new Error('No scope set for scoped group');
					if (!node.children) throw new Error('No nodes in scoped group');

					push(await this.renderPass(node.children, step, node.ctx));

					break;

				default:
					throw new Error('Unhandled node: ' + require('util').inspect(node) + ' (not implemented?)');
			}
		}

		return output;
	}

	private getValue(node : Node, ctx : Context) : string {
		if (node.type === NodeType.LiteralValue) {
			if (!node.value) throw new Error('Value node without value');
			return node.value.value;
		}

		if (node.type === NodeType.Variable) {
			if (!node.value) throw new Error('Variable node without value');
			const value = ctx.getValue<any>(node.value.value);

			if (value === undefined) return 'undefined';
			if (value === null) return 'null';

			return value;
		}

		throw new Error('Unknown value type: ' + node.type);
	}

	private async execFunction(step : RenderStep, node : Node, ctx : Context, input ?: FnInput) : Promise<string | Node | null> {
		if (!node.value) throw new Error('Variable node without value');
		const name = node.value.value;

		if (!hasPre(name) && !hasFn(name) && !hasPost(name)) {
			throw new Error('Function `' + name + '` does not exist');
		}

		const params : any[] = [];
		if (node.params) {
			for (const param of node.params) {
				if (!param.value) continue;
				if (param.type === NodeType.LiteralValue) {
					params.push({ value: param.value.value });
				} else if (param.type === NodeType.Variable) {
					params.push({
						ident: param.value.value,
						value: ctx.getValue(param.value.value),
					});
				}
			}
		}

		const args : FnArgs = {
			ctx,
			node,
			input,
			args: params,
			block: node.children,
			elseBlock: node.elseChildren,
		};

		if (step === RenderStep.Pre && hasPre(name)) return execPre(name, args);
		else if (step === RenderStep.Post && hasPost(name)) return execPost(name, args);
		else if (hasFn(name)) return execFn(name, args);

		if (input) return null; // Return null for piped functions
		return node;
	}

}
