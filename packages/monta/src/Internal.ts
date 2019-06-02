import { Renderer } from './Renderer';
import { loadPlugins } from './plugins';
import { createTemplateFromCode, createTemplateFromFile, Template } from './Template';
import { collectOptions, MontaOptions } from './Options';

export class Internal {

	/** Will resolve when Monta is fully loaded */
	public readonly load : Promise<void>;

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
		this.load = new Promise(async (resolve) => {
			await loadPlugins();

			this.options = collectOptions(options);

			this.renderer = new Renderer(this);

			resolve();
		});
	}

	/**
	 * Compiles code into a template function
	 *
	 * @param code - The code to compile
	 */
	public async compile(code : string) : Promise<Template> {
		await this.load;
		return createTemplateFromCode(this, code);
	}

	/**
	 * Compiles a file into a template function
	 *
	 * @param filePath - Path to the file, will be resolved from the configured include path
	 */
	public async compileFile(filePath : string) : Promise<Template> {
		await this.load;
		return createTemplateFromFile(this, filePath);
	}
}
