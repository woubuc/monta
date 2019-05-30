import path from 'path';
import { execFn, FnArgs, hasFn } from './plugins/Fn';

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

export class Context {

	private readonly root : Context;
	private readonly parent? : Context;

	private readonly data : object;
	public meta : ContextMeta;

	private readonly functionData : Map<string, any>;

	constructor(data : object, parent? : Context) {
		this.data = data;

		if (parent) {
			this.functionData = parent.functionData;
			this.root = parent.root;
			this.parent = parent;

			this.meta = new ContextMeta(parent.meta);
		} else {
			this.root = this;
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

	public hasFn(name : string) : boolean {
		return hasFn(name);
	}

	public async execFn(name : string, args : Exclude<FnArgs, 'ctx'>) : Promise<any> {
		return execFn(name, { ...args, ctx: this });
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
