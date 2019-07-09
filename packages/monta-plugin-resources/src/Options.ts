import path from 'path';
import root from 'app-root-path';

import { MontaOptions, MontaPlugin } from 'monta';

export interface ResourcePluginOptions {
	publicDir : string;
	baseUrl : string;
}

export type ResourcePlugin = MontaPlugin<ResourcePluginOptions>;

export function collectOptions(plugin : ResourcePlugin) : MontaOptions {

	const publicDir = plugin.pluginOptions.publicDir || path.join(root.toString(), 'public');
	const baseUrl = plugin.pluginOptions.baseUrl || '/';

	plugin.options.pluginOptions.resources = { publicDir, baseUrl };

	return plugin.options;
}
