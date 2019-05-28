import CompiledTemplate from './CompiledTemplate';
import { parse, parseFile } from './parser';
import path from 'path';

export async function compileFile(filePath : string) : Promise<CompiledTemplate> {
	return new CompiledTemplate(filePath, path.dirname(filePath), await parseFile(filePath));
}

export async function compile(code : string, includePath? : string) : Promise<CompiledTemplate> {
	if (!includePath) includePath = process.cwd();
	return new CompiledTemplate('', includePath, await parse(code, includePath));
}

export async function express(filePath : string, data : object, callback : (err : any, result : string) => void) {
	const template = await compileFile(filePath);
	const result = await template.render(data);
	callback(null, result);
}
