import { readFile } from 'fs-extra';
import path from 'path';

import Parser, { Node, NodeType } from './Parser';
import Lexer from './lexer/Lexer';

/**
 * Parses a piece of template code
 * @param templateRoot - Root directory
 * @param code         - The code to parse
 */
export async function parse(templateRoot : string, code : string) : Promise<Node[]> {
	// Parse template
	const tokens = new Lexer().run(code);
	let nodes = new Parser(tokens).run();

	if (nodes.length == 0) return [];

	// Check for extend() function as first node in the template
	if (nodes[0].type === NodeType.Function && nodes[0].value && nodes[0].value.value === 'extends') {
		const extendNode = nodes.shift() as Node;

		const params = extendNode.params;
		if (!params || !params[0] || !params[0].value) throw new Error('Missing function param for `extend` function');

		const baseFile = path.resolve(templateRoot, params[0].value.value);
		const baseNodes = await parseFile(templateRoot, baseFile);

		// Extend will prepend all nodes of the base template to the current nodes array
		nodes.unshift(...baseNodes);
	}

	return nodes;
}

/**
 * Parses a file containing template code
 * @param templateRoot - Root directory
 * @param filePath     - Path to the file
 */
export async function parseFile(templateRoot : string, filePath : string) : Promise<Node[]> {
	filePath = path.resolve(templateRoot, filePath);

	const source = await readFile(filePath);
	return parse(templateRoot, source.toString());
}
