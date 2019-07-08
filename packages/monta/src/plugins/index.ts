import root from 'app-root-path';
import { decamelize } from 'humps';
import { registerFn, registerPost, registerPre } from './Fn';

const BUILTINS = [
	'controlFlow',
	'define',
	'foreach',
	'include',
	'json',
	'stringFn'
];

export interface MontaPlugin {
	registerFn : typeof registerFn;
	registerPre : typeof registerPre;
	registerPost : typeof registerPost;

	options : Record<string, string>;
}

const loadedPlugins : string[] = [];

export function pluginLoaded(name : string) : boolean {
	return loadedPlugins.includes(name);
}

export function loadPlugins(pluginOptions : Record<string, object>, customPlugins : Record<string, string>) : void {

	const plugins : Record<string, string> = Object.assign({},
		BUILTINS.reduce((acc : Record<string, string>, name) => {
			acc[`builtins/${ name }`] = `./builtins/${ name }`;
			return acc;
		}, {}),
		discoverPlugins(),
		customPlugins,
	);

	for (const name of Object.keys(plugins)) {
		const path = plugins[name];

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		let plugin = require(path);
		if (plugin.default) plugin = plugin.default;

		if (typeof plugin !== 'function') {
			throw new Error(`Plugin ${ name } exported '${ typeof plugin }', expected function.`);
		}

		loadedPlugins.push(name);

		const options = pluginOptions[decamelize(name)] || {};
		plugin({ registerFn, registerPre, registerPost, options });
	}
}

function discoverPlugins() : Record<string, string> {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const pkg = require(root + '/package.json');

	return Object.entries(pkg.dependencies)
		.map(([name]) => name)
		.filter(name => name.startsWith('monta-plugin-'))
		.reduce((acc : Record<string, string>, name) => {
			acc[name.replace('monta-plugin-', '')] = name;
			return acc;
		}, {});
}
