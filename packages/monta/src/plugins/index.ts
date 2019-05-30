import root from 'app-root-path';
import { registerFn, registerPost, registerPre } from './Fn';

const BUILTINS = ['define', 'include', 'stringFn'];

export interface MontaPlugin {
	registerFn : typeof registerFn;
	registerPre : typeof registerPre;
	registerPost : typeof registerPost;
}

export async function loadPlugins() {

	const plugins = [
		...BUILTINS.map(b => `./builtins/${ b }`),
		...await discoverPlugins(),
	];

	for (const name of plugins) {
		let plugin = await import(name);
		if (plugin.default) plugin = plugin.default;
		if (typeof plugin !== 'function') throw new Error('Plugin ' + name + ' is not a function');

		plugin({ registerFn, registerPre, registerPost } as MontaPlugin);
	}
}

async function discoverPlugins() : Promise<string[]> {
	const pkg = await import(root + '/package.json');

	return Object.entries(pkg.dependencies)
		.map(([name]) => name)
		.filter(name => name.startsWith('monta-plugin-'));
}
