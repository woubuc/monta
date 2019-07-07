import path from 'path';

import { Node } from './parser/Parser';
import { Context, ContextMeta } from './Context';
import { Internal } from './Internal';
import { parse, parseFile } from './parser';

export type Template = (data ?: any) => Promise<string>;

export async function createTemplateFromCode(monta : Internal, code : string) : Promise<Template> {
	const nodes = await parse(monta.options.templateRoot, code);
	return createTemplate(monta, nodes, new ContextMeta());
}

export async function createTemplateFromFile(monta : Internal, fileName : string) : Promise<Template> {
	fileName = path.resolve(monta.options.templateRoot, fileName);

	const nodes = await parseFile(monta.options.templateRoot, fileName);
	return createTemplate(monta, nodes, new ContextMeta({ file: fileName }));
}

async function createTemplate(monta : Internal, nodes : Node[], meta : ContextMeta) : Promise<Template> {
	return async function render(data : Record<string, any> = {}) {
		return monta.renderer.render(nodes, new Context(monta.options, data, meta));
	};
}
