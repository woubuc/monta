import root from 'app-root-path';
import path from 'path';

/**
 * The options that can be passed to Monta
 */
export interface MontaOptions {
	/** Base directory to use when resolving file paths (e.g. in `extends` or `include` functions) */
	templateRoot : string;

	/** The plugin options */
	pluginOptions : Record<string, object>;

	/** Plugins to load. Shouldn't be used in most cases, Monta can detect plugins on its own */
	plugins : Record<string, string>;
}

/**
 * Collects and validates the Monta options object, falling back to
 * default values for missing properties.
 *
 * @param options - The options object as received from the user
 */
export function collectOptions(options : Partial<MontaOptions>) : MontaOptions {

	const templateRoot = options.templateRoot || path.join(root.toString(), 'views');

	const pluginOptions = options.pluginOptions || {};
	const plugins = options.plugins || {};

	return { templateRoot, pluginOptions, plugins };
}
