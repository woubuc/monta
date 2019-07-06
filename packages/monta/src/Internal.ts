import { Renderer } from './Renderer';
import { loadPlugins } from './plugins';
import { createTemplateFromCode, createTemplateFromFile, Template } from './Template';
import { collectOptions, MontaOptions } from './Options';

export class Internal {

	/** Renderer for this Monta instance */
	public renderer! : Renderer;

	/** The provided configuration options */
	public options! : MontaOptions;

	/**
	 * Initialises the internal Monta instance
	 *
	 * @param options - The options passed to Monta
	 */
	public constructor(options ?: Partial<MontaOptions>) {
		loadPlugins();
		this.options = collectOptions(options);
		this.renderer = new Renderer(this);
	}

	/**
	 * Compiles code into a template function
	 *
	 * @param code - The code to compile
	 */
	public async compile(code : string) : Promise<Template> {
		return createTemplateFromCode(this, code);
	}

	/**
	 * Compiles a file into a template function
	 *
	 * @param filePath - Path to the file, will be resolved from the configured include path
	 */
	public async compileFile(filePath : string) : Promise<Template> {
		return createTemplateFromFile(this, filePath);
	}
}
