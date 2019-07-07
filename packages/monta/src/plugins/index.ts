import root from 'app-root-path';
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
}

const loadedPlugins : string[] = [];

export function pluginLoaded(name : string) : boolean {
	return loadedPlugins.includes(name);
}

export function loadPlugins(customPlugins : Record<string, string>) : void {

	const plugins : Record<string, string> = Object.assign({},
		BUILTINS.reduce((acc : Record<string, string>, name) => {
			acc[name] = `./builtins/${ name }`;
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
		if (typeof plugin !== 'function') throw new Error(`Plugin ${ name } is '${ typeof plugin }', expected function.`);

		loadedPlugins.push(name);
		plugin({ registerFn, registerPre, registerPost });
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
