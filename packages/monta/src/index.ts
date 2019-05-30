import CompiledTemplate from './CompiledTemplate';
import { parse, parseFile } from './parser';
import path from 'path';
import { loadPlugins } from './plugins';


export async function compileFile(filePath : string) : Promise<CompiledTemplate> {
	await loadPlugins();
	return new CompiledTemplate(filePath, path.dirname(filePath), await parseFile(filePath));
}

export async function compile(code : string, includePath? : string) : Promise<CompiledTemplate> {
	await loadPlugins();
	if (!includePath) includePath = process.cwd();
	return new CompiledTemplate('', includePath, await parse(code, includePath));
}

export async function render(code : string, includePath? : string, data? : Record<string, any>) : Promise<string>;
export async function render(code : string, data? : Record<string, any>) : Promise<string>;
export async function render(code : string, includePathOrData? : string | Record<string, any>, dataOrNone? : Record<string, any>) : Promise<string> {
	let includePath : string | undefined = undefined;
	let data : Record<string, any> | undefined = undefined;

	if (typeof includePathOrData === 'string') {
		includePath = includePathOrData;
		data = dataOrNone;
	} else {
		data = includePathOrData;
	}

	const template = await compile(code, includePath);
	return template.render(data);
}


export async function express(filePath : string, data : object, callback : (err : any, result : string) => void) {
	await loadPlugins();
	const template = await compileFile(filePath);
	const result = await template.render(data);
	callback(null, result);
}

export { Context } from './Context';
export { Node } from './parser/Parser';
export { MontaPlugin } from './plugins';
export { Fn, FnConfig, FnArgs } from './plugins/Fn';
