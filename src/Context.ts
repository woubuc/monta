import path from 'path';
import { FnDef } from './functions';

export class ContextMeta {

	public path : string = '';
	public file : string = '';
	public get filename() { return path.basename(this.file) }

	constructor(data? : ContextMeta) {
		if (data) {
			this.path = data.path;
			this.file = data.file;
		}
	}
}

export default class Context {

	private readonly root : Context;
	private readonly parent? : Context;

	private readonly data : object;
	public meta : ContextMeta;

	private readonly functions : Map<string, FnDef>;
	private readonly functionData : Map<string, any>;

	constructor(data : object, functions : Map<string, FnDef>);
	constructor(data : object, parent : Context);
	constructor(data : object, functionsOrParent : Map<string, FnDef> | Context) {
		this.data = data;

		if (functionsOrParent instanceof Context) {
			const parent = functionsOrParent as Context;
			this.functions = parent.functions;
			this.functionData = parent.functionData;
			this.root = parent.root;
			this.parent = parent;

			this.meta = new ContextMeta(parent.meta);
		} else {
			this.root = this;
			this.functions = functionsOrParent;
			this.functionData = new Map();

			this.meta = new ContextMeta();
		}
	}

	public getData<T>(key : string) : T | undefined {
		return this.functionData.get(key);
	}

	public setData<T>(key : string, value : T) {
		this.functionData.set(key, value);
	}

	public getValue<T>(path : string) : T | undefined {
		const value = this.getDataPath(path);
		if (!value) return undefined;
		return value as T;
	}

	public getFunction(name : string) : FnDef | undefined {
		return this.functions.get(name);
	}

	public getSubContext(path : string = '.') : Context {
		return new Context(this.getDataPath(path), this);
	}

	private getDataPath(path : string) : any {
		if (path === '.') return this.data;

		let data : any = this.data;

		let keys = path.split('.');

		if (keys[0] === '$meta') {
			data = this.meta;
			keys.shift();
		}

		if (keys[0] === '$parent') {
			data = this.parent;
			keys.shift();
		}

		if (keys[0] === '$root') {
			data = this.root;
			keys.shift();
		}

		while (keys.length > 0) {
			const next : any = data[keys.shift() as string];
			if (next == undefined) return null;
			data = next;
		}

		return data;
	}

}
