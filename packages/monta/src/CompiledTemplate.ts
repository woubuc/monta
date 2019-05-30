import { Node } from './parser/Parser';
import { Context } from './Context';
import { Renderer } from './Renderer';

export default class CompiledTemplate {

	private readonly nodes : Node[];

	private readonly file : string;
	private readonly path : string;

	constructor(file : string, path : string, nodes : Node[]) {
		this.file = file;
		this.path = path;

		this.nodes = nodes;
	}

	public async render(data : Record<string, any> = {}) : Promise<string> {
		const ctx = new Context(data);
		ctx.meta.file = this.file;
		ctx.meta.path = this.path;

		const renderer = new Renderer();
		return renderer.render(this.nodes, ctx);
	}
}
