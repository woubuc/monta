import { Template } from './Template';
import { Internal } from './Internal';
import { MontaOptions } from './Options';

/**
 * Symbol identifier for the internal object in the
 * public Monta class. This is used to prevent internals
 * from showing up in a simple `console.log()` or
 * `util.inspect()` of a Monta class instance.
 */
const internal = Symbol('internal');

/**
 * The main Monta class, contains all methods needed for
 * compiling code and rendering templates.
 */
export default class Monta {

	/** The internal functionality, not exposed to the users */
	private readonly [internal] : Internal;

	/**
	 * Initialises Monta
	 *
	 * @param options - The Monta configuration options
	 */
	public constructor(options?: Partial<MontaOptions>) {
		this[internal] = new Internal(options);
	}

	/**
	 * Compiles code into a template function
	 *
	 * @param code - The code to compile
	 */
	public compile(code: string) : Promise<Template> {
		return this[internal].compile(code);
	}

	/**
	 * Compiles a file into a template function
	 *
	 * @param filePath - Path to the file, will be resolved from the configured include path
	 */
	public compileFile(filePath : string) : Promise<Template> {
		return this[internal].compileFile(filePath);
	}

	/**
	 * Compiles a piece of code and renders it immediately
	 *
	 * Effectively the same as calling `compile()` and then executing the render function
	 *
	 * @param code - The code to render
	 * @param data - Data to use in the template
	 */
	public async render(code : string, data : Record<string, any> = {}) : Promise<string> {
		const render = await this.compile(code);
		return render(data);
	}

	/**
	 * Compiles a template file and renders it immediately
	 *
	 * Effectively the same as calling `compileFile()` and then executing the render function
	 *
	 * @param filePath - Path to the file
	 * @param data     - Data to use in the template
	 */
	public async renderFile(filePath : string, data : Record<string, any> = {}) : Promise<string> {
		const render = await this.compileFile(filePath);
		return render(data);
	}

	/**
	 * Custom wrapper for use with Express 4
	 *
	 * @param filePath - Path to the file
	 * @param data     - Template data
	 * @param callback - Callback function to be called when the template has been rendered
	 */
	public async express(filePath : string, data : Record<string, any>, callback : (err : any, result : string) => void) {
		const result = await this.renderFile(filePath, data);
		callback(null, result);
	}
}

// TODO turn remaining exports into interfaces
export { Context, ContextMetaData } from './Context';
export { Node } from './parser/Parser';
export { MontaPlugin } from './plugins';
export { Fn, FnConfig, FnArgs } from './plugins/Fn';
export { MontaOptions, MontaPluginOptions } from './Options';
