import { Node } from './parser/Parser';
import Context from './Context';
import { loadFunctions } from './functions';
import { render } from './render';

export default class CompiledTemplate {

	private readonly nodes : Node[];

	private readonly file : string;
	private readonly path : string;

	constructor(file : string, path : string, nodes : Node[]) {
		this.file = file;
		this.path = path;

		this.nodes = nodes;
	}

	public async render(data : { [key : string] : any } = {}) : Promise<string> {
		const ctx = new Context(data, await loadFunctions());
		ctx.meta.file = this.file;
		ctx.meta.path = this.path;
		return render(this.nodes, ctx);
	}
}
