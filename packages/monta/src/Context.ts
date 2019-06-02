import path from 'path';
import { execFn, FnArgs, hasFn } from './plugins/Fn';
import { MontaOptions } from './Options';

export interface ContextMetaData {
	/** Directory containing the current template file */
	path : string;

	/** Full path to the current file */
	file : string;

	/** Filename of the current template file */
	filename : string;
}

export class ContextMeta implements ContextMetaData {

	public readonly file : string = '';
	public readonly path : string = '';
	public readonly filename : string = '';

	constructor();
	constructor(data : ContextMeta);
	constructor(data : Partial<ContextMetaData>);
	constructor(data? : ContextMeta | Partial<ContextMetaData>) {
		if (!data) return;

		if (data.file) {
			this.file = data.file;
			this.path = path.dirname(data.file);
			this.filename = path.basename(data.file);
		}
	}
}

export class Context {

	private readonly root : Context;
	private readonly parent? : Context;

	private readonly data : Record<string, any>;
	public meta : ContextMetaData;

	private readonly functionData : Map<string, any>;
	public options : MontaOptions;

	constructor(options : MontaOptions);
	constructor(options : MontaOptions, data : Record<string, any>);
	constructor(options : MontaOptions, data : Record<string, any>, parent : Context);
	constructor(options : MontaOptions, data : Record<string, any>, meta : ContextMeta);
	constructor(options : MontaOptions, data : Record<string, any>, parent : Context, meta : ContextMeta);
	constructor(options : MontaOptions, data : Record<string, any> = {}, parentOrMeta? : Context | ContextMeta, meta? : ContextMeta) {
		this.options = options;
		this.data = data;

		if (parentOrMeta instanceof Context) {
			this.functionData = parentOrMeta.functionData;
			this.root = parentOrMeta.root;
			this.parent = parentOrMeta;

			if (meta) this.meta = new ContextMeta(meta);
			else this.meta = new ContextMeta(parentOrMeta.meta);

			return;
		}

		this.root = this;
		this.functionData = new Map();

		if (parentOrMeta instanceof ContextMeta) this.meta = new ContextMeta(parentOrMeta);
		else this.meta = new ContextMeta();
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
		return new Context(this.options, this.getDataPath(path), this);
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
