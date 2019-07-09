import { ResourcePlugin } from './Options';

import get from './functions/get';
import inline from './functions/inline';
import toUrl from './functions/toUrl';

export default function(plugin : ResourcePlugin) : void {

	plugin.registerFn('get', get.bind(plugin), { maxArgs: 1 });
	plugin.registerFn('inline', inline.bind(plugin), { pipeRequired: true });
	plugin.registerFn('toUrl', toUrl.bind(plugin), { pipeRequired: true });

}

export { Resource } from './Resource';
export { ResourcePluginOptions } from './Options';
