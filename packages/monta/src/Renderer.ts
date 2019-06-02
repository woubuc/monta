import { Node, NodeType } from './parser/Parser';
import { Iterator } from './util/Iterator';
import { Context } from './Context';
import { execFn, execPost, execPre, FnArgs, hasFn, hasPost, hasPre } from './plugins/Fn';
import { Internal } from './Internal';

enum RenderStep { Pre, Fn, Post }

type Output = (string | Node)[];

export class Renderer {

	private output : Output = [];

	constructor(_ : Internal) { }

	public async render(nodes : Node[], ctx : Context) : Promise<string> {
		this.output = nodes;

		while(true) {
			if (!await this.renderPass(RenderStep.Pre, ctx)) continue;
			if (!await this.renderPass(RenderStep.Fn, ctx)) continue;
			if (!await this.renderPass(RenderStep.Post, ctx)) continue;
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

	private async renderPass(step : RenderStep, ctx : Context) : Promise<boolean> {
		const output : Output = [];
		const push = (data : Output | string | Node) => {
			if (Array.isArray(data)) output.push(...data);
			else output.push(data);
		};

		const source = new Iterator(this.output);

		let stepFnDone = true;

		while (source.hasNext()) {
			const node = source.next();

			if (typeof node === 'string') {
				push(node);
				continue;
			}

			switch (node.type) {
				case NodeType.TemplateOutput:
					if (!node.params) continue;

					for (const param of node.params) {
						push(this.getValue(param, ctx));
					}
					break;

				case NodeType.TokenGroup:
					console.log('Unknown token group:', node);
					break;

				case NodeType.Function:
					const result = await this.execFunction(step, node, ctx);
					if (result != null) push(result);
					break;

				case NodeType.Expression:
					console.warn('Operator expressions not implemented yet (on line: ' + (node.params ? node.params.map(p => p.value ? p.value.value : '') : []).join(' ') + ')'); // TODO implement expressions
					break;

				case NodeType.PipeSequence:
					let lastValue : any = undefined;
					for (const next of node.params as Node[]) {

						if (next.type === NodeType.Variable) {
							if (lastValue != undefined) console.warn('Piping into variable');
							lastValue = ctx.getValue(next.value!.value);
							continue;
						}

						if (next.type === NodeType.LiteralValue) {
							if (lastValue != undefined) console.warn('Piping into literal value');
							lastValue = this.getValue(next, ctx);
							continue;
						}


						if (next.type === NodeType.Function) {
							const output = await this.execFunction(step, next, ctx, lastValue);
							if (output != null) {
								lastValue = output;
								stepFnDone = false;
							}
							continue;
						}

						throw new Error('Unexpected node: ' + (node.value? node.value.value : ''));
					}

					push(lastValue);

					break;

				default:
					console.error('Unhandled node:', node);
			}
		}

		this.output = output;

		return stepFnDone;
	}

	private getValue(node : Node, ctx : Context) : string {
		if (node.type === NodeType.LiteralValue) {
			return node.value!.value;
		}

		if (node.type === NodeType.Variable) {
			const value = ctx.getValue<string>(node.value!.value);

			if (!value) return 'undefined';
			return value.toString();
		}

		throw new Error('Unknown value type: ' + node.type);
	}

	private async execFunction(step : RenderStep, node : Node, ctx : Context, input? : any) : Promise<string | Node | null> {
		const name = node.value!.value;

		if (!hasPre(name) && !hasFn(name) && !hasPost(name)) {
			throw new Error('Function `' + name + '` does not exist');
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
