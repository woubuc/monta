import Parser, { Node, NodeType } from './Parser';
import { readFile } from 'fs-extra';
import Lexer from './lexer/Lexer';
import path from "path";

/**
 * Parses a piece of template code
 * @param code        - The code to parse
 * @param includePath - Base path to use for include and extend functions
 */
export async function parse(code : string, includePath : string) : Promise<Node[]> {
	// Parse template
	const tokens = new Lexer().run(code);
	let nodes = new Parser(tokens).run();

	if (nodes.length == 0) return [];

	// Check for extend() function as first node in the template
	if (nodes[0].type === NodeType.Function && nodes[0].value && nodes[0].value.value === 'extends') {
		const extendNode = nodes.shift() as Node;

		const params = extendNode.params;
		if (!params || !params[0] || !params[0].value) throw new Error('Missing function param for `extend` function');

		const baseFile = path.join(includePath, params[0].value.value);
		const baseNodes = await parseFile(baseFile);

		// Extend will prepend all nodes of the base template to the current nodes array
		nodes.unshift(...baseNodes);
	}

	return nodes;
}

/**
 * Parses a file containing template code
 * @param filePath - Path to the file
 */
export async function parseFile(filePath : string) : Promise<Node[]> {
	filePath = path.resolve(filePath);

	const source = await readFile(filePath);
	return parse(source.toString(), path.dirname(filePath));
}
