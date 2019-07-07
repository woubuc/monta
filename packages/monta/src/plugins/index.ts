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

export function loadPlugins() : void {

	const plugins = [
		...BUILTINS.map(b => `./builtins/${ b }`),
		...discoverPlugins(),
	];

	for (const name of plugins) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		let plugin = require(name);
		if (plugin.default) plugin = plugin.default;
		if (typeof plugin !== 'function') throw new Error(`Plugin ${ name } is '${ typeof plugin }', expected function.`);

		loadedPlugins.push(name.slice(13));
		plugin({ registerFn, registerPre, registerPost });
	}
}

function discoverPlugins() : string[] {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const pkg = require(root + '/package.json');

	return Object.entries(pkg.dependencies)
		.map(([name]) => name)
		.filter(name => name.startsWith('monta-plugin-'));
}
