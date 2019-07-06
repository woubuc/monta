import minimatch from 'minimatch';

import { MontaPlugin } from '../index';

export default function(plugin : MontaPlugin) : void {

	plugin.registerFn('sort',
		({ input, args }) => sort(input ? input.value : args[0].value),
		{ maxArgs: 1 });

	plugin.registerFn('filter',
		({ input, args }) => filter(input ? input.value : args[0].value, input ? args[0].value : args[1].value),
		{ maxArgs: 2, requiredArgs: 1 });

}

function sort<T>(arr : T[]) : T[] {
	arr.sort();
	return arr;
}

function filter(arr : string[], pattern : string) : string[] {
	return arr.filter(i => minimatch(i, pattern));
}
