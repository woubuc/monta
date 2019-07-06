import path from 'path';
import { execFn, FnArgs, hasFn, hasPost, hasPre } from './plugins/Fn';
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

	public constructor();
	public constructor(data : ContextMeta);
	public constructor(data : Partial<ContextMetaData>);
	public constructor(data ?: ContextMeta | Partial<ContextMetaData>) {
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
	private readonly parent ?: Context;

	private readonly data : any;
	public meta : ContextMetaData;

	private readonly functionData : Map<string, any>;
	public options : MontaOptions;

	public constructor(options : MontaOptions);
	public constructor(options : MontaOptions, data : any);
	public constructor(options : MontaOptions, data : any, parent : Context);
	public constructor(options : MontaOptions, data : any, meta : ContextMeta);
	public constructor(options : MontaOptions, data : any, parent : Context, meta : ContextMeta);
	public constructor(options : MontaOptions, data : any = {}, parentOrMeta ?: Context | ContextMeta, meta ?: ContextMeta) {
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

	public setData<T>(key : string, value : T) : void {
		this.functionData.set(key, value);
	}

	public getValue<T>(path : string) : T | undefined {
		const value = this.getDataPath(path);
		if (!value) return undefined;
		return value as T;
	}

	public hasFn(name : string) : boolean {
		return hasFn(name) || hasPre(name) || hasPost(name);
	}

	public async execFn(name : string, args : Exclude<FnArgs, 'ctx'>) : Promise<any> {
		return execFn(name, { ...args, ctx: this });
	}

	public getSubContext(path : string = '.') : Context {
		return new Context(this.options, this.getDataPath(path), this);
	}

	public getCustomContext(data : Record<string, any>) : Context {
		return new Context(this.options, data, this);
	}

	private getDataPath(path : string) : any {
		console.log('Getting path', path, 'of data', this.data);
		if (path === '.' || path === 'this') return this.data;

		if (typeof this.data !== 'object') throw new Error(`Cannot get property '${ path }' of primitive value '${ this.data }'`);

		let data : any = this.data;

		let keys = path.split('.');

		if (keys[0] === 'this' || keys[0] === '') {
			keys.shift();
		}

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
