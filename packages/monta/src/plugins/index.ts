/* When a Monta instance is intialised, all plugins are
 * loaded. There are three kinds of plugins:
 * - Builtins
 * - Custom plugins
 * - Discovered plugins
 *
 * Builtin plugins are defined in a static array by their
 * module name. This module is loaded and the plugin function
 * is executed.
 *
 * Custom plugins are passed through the `plugins` property
 * in the Monta options. This usually isn't necessary, since
 * plugins should be auto-discovered. But for custom plugins
 * (and for testing local plugins) this can be useful.
 *
 * The discovered plugins should be the most prevalent type
 * of third-party plugin. They are added as dependencies to
 * the top-level project, and Monta will parse the list of
 * dependencies to discover all plugins. The name of a
 * discoverable plugin should always be prefixed with
 * `monta-plugin-`.
 *
 * The plugin system at this point is quite rudimentary.
 * New functionality is being added as the project grows
 * and additional use cases are discovered.
 */

import root from 'app-root-path';
import { camelize } from 'humps';

import { registerFn, registerPost, registerPre } from './Fn';
import { MontaOptions } from '../Options';

/**
 * This object is passed to the main function of a plugin
 * when it's loaded
 */
export interface MontaPlugin<PluginOptionsType> {
	/**
	 * Registers a template function
	 *
	 * @param name     - Name of the function
	 * @param exec     - Called with the {@link FnArgs} when
	 *                   the function is called
	 * @param [config] - Options for the function
	 */
	registerFn : typeof registerFn;

	/**
	 * Registers a pre-function
	 * @see registerFn
	 *
	 * A pre-function runs on the first pass of rendering,
	 * before any regular functions are executed.
	 *
	 * Pre-functions cannot pipe to other functions, and
	 * should generally only be used for functions that
	 * produce substantial changes to the node structure.
	 */
	registerPre : typeof registerPre;

	/**
	 * Registers a post-function
	 * @see registerFn
	 *
	 * A post-function runs on the last pass of rendering,
	 * after all other functions have been executed.
	 *
	 * Post-functions have the same limitations as pre-
	 * functions, and should generally only be used to
	 * finalise data that other functions have produced.
	 */
	registerPost : typeof registerPost;

	/**
	 * The core options object of the Monta instance
	 */
	options : MontaOptions;

	/**
	 * The options object provided in the `pluginOptions`
	 * for this specific plugin
	 *
	 * Will be an empty object is no options were
	 * provided for the current plugin.
	 */
	pluginOptions : PluginOptionsType;
}

/**
 * Filenames of the built-in plugins in `builtins/`, to avoid
 * having to `readDir` on startup, since this is static information
 *
 * @const
 */
const BUILTINS = [
	'controlFlow',
	'define',
	'foreach',
	'include',
	'json',
	'stringFn'
];

/**
 * Loads all plugins and runs their initialiser functions
 *
 * @param options - The Monta options
 *
 * TODO added tests for the plugin loading process
 */
export function loadPlugins(options : MontaOptions) : void {

	// Map the names of builtin plugins to a key-value object
	const builtins = BUILTINS.reduce((acc : Record<string, string>, name) => {
		acc[`builtins/${ name }`] = `./builtins/${ name }`;
		return acc;
	}, {});

	// Create an object that contains all discovered plugins
	// as `name: path` key-value pairs
	const plugins : Record<string, string> = Object.assign({},
		builtins,
		discoverPlugins(),
		options.plugins,
	);

	// Load all plugins one by one and run their initialiser functions
	for (const name of Object.keys(plugins)) {
		const path = plugins[name];

		// Load the plugins with `require` because it is synchronous
		// and we don't want to run into race conditions here.
		let pluginFn = require(path); // eslint-disable-line @typescript-eslint/no-var-requires
		if (pluginFn.default) pluginFn = pluginFn.default;

		// Every plugin should export a function as their main
		// `module.exports` or `export default`. This function
		// will be called here, so if a plugin doesn't have one
		// we'll just throw an error.
		if (typeof pluginFn !== 'function') {
			throw new Error(`Plugin ${ name } exported '${ typeof pluginFn }', expected function.`);
		}

		// The plugin options passed to the Monta initialiser
		// contain the _CamelCase_ plugin names as keys, as is
		// standard in Javascript. However, npm packages are
		// traditionally _kebab-case_, so we need to convert
		// the keys to _CamelCase_ before checking if an options
		// key exists.
		const pluginOptions = options.pluginOptions[camelize(name)] || {};

		// Finally, assemble the plugin data and call the initialiser function
		const plugin : MontaPlugin<any> = { registerFn, registerPre, registerPost, options, pluginOptions };
		pluginFn.call(null, plugin);
	}
}

/**
 * Discovers the plugins in the dependencies of the root package
 *
 * @returns An object containg the discovered plugins as
 *          `name: path` key-value pairs
 */
function discoverPlugins() : Record<string, string> {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const pkg = require(root + '/package.json');

	return Object.keys(pkg.dependencies)
		.filter(name => name.startsWith('monta-plugin-'))
		.reduce((acc : Record<string, string>, pkgName) => {
			const name = pkgName.replace('monta-plugin-', '');
			acc[name] = pkgName;
			return acc;
		}, {});
}
