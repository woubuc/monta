import decamelize from 'decamelize';
import { pluginLoaded } from './plugins';

/**
 * The plugin options that can be passed to Monta
 *
 * This interface is empty by default, but plugins
 * should add their configuration values to it.
 */
export interface MontaPluginOptions { } // eslint-disable-line @typescript-eslint/no-empty-interface

/**
 * The options that can be passed to Monta
 */
export interface MontaOptions {
	/** Base directory to use when resolving file paths (e.g. in `extends` or `include` functions) */
	templateRoot : string;

	/** The plugin options */
	plugins : MontaPluginOptions;
}

/**
 * Collects and validates the Monta options object, falling back to
 * default values for missing properties.
 *
 * @param options - The options object as received from the user
 */
export function collectOptions(options : Partial<MontaOptions> = {}) : MontaOptions {

	const templateRoot = options.templateRoot || process.cwd();

	const plugins = options.plugins || {};
	for (const key of Object.keys(plugins)) {
		const name = decamelize(key, '-');
		if (!pluginLoaded(name)) throw new Error('Plugin options defined for non-existent plugin: ' + name);
	}

	return { templateRoot, plugins };
}
