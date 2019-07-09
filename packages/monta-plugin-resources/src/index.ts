import { ResourcePlugin } from './Options';

import concat from './functions/concat';
import get from './functions/get';
import inline from './functions/inline';
import minify from './functions/minify';
import toUrl from './functions/toUrl';

export default function(plugin : ResourcePlugin) : void {

	plugin.registerFn('concat', concat.bind(plugin), { requiredArgs: 1 });
	plugin.registerFn('get', get.bind(plugin), { maxArgs: 1 });
	plugin.registerFn('inline', inline.bind(plugin), { pipeRequired: true });
	plugin.registerFn('minify', minify.bind(plugin), { pipeRequired: true });
	plugin.registerFn('toUrl', toUrl.bind(plugin), { pipeRequired: true });

}

export { Resource } from './Resource';
export { ResourcePluginOptions } from './Options';
