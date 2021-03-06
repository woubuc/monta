import { Iterator } from '../util/Iterator';
import { TokenType } from './lexer/TokenType';
import { Token } from './lexer/Token';
import { Context } from '../Context';

export enum NodeType {
	TemplateOutput,
	TokenGroup,
	Function,
	Expression,
	PipeSequence,
	Variable,
	Operator,
	LiteralValue,
	ScopedGroup,
}

const nodeProps = Object.freeze(['type', 'ctx', 'value', 'params', 'children', 'elseChildren']);

export class Node {
	public type! : NodeType;

	public ctx ?: Context;
	public value ?: Token;

	public params ?: Node[];
	public children ?: Node[];
	public elseChildren ?: Node[];

	/**
	 * Checks if a given object is a Node
	 *
	 * @param obj - The object to check
	 *
	 * @returns True if the object is a Node
	 */
	public static isNode(obj : any) : boolean {
		if (typeof obj !== 'object') return false;
		if (Array.isArray(obj)) return false;

		const props = Object.getOwnPropertyNames(obj);
		if (props.length > nodeProps.length) return false;
		return props.every(k => nodeProps.includes(k));
	}
}

export interface NodeWithParams extends Node {
	params : Node[];
}

export default class Parser {

	private readonly source : Iterator<Token>;

	public constructor(tokens : Token[]) {
		this.source = new Iterator(tokens);
	}

	public run() : Node[] {
		const nodes : Node[] = [];

		while (this.source.hasNext()) {
			nodes.push(...this.parseBlock(true));
		}

		return nodes;
	}

	private parseBlock(root : boolean = false) : Node[] {
		const nodes : Node[] = [];

		while (this.source.hasNext()) {
			const peek = this.source.peek() as Token;

			if (peek.type === TokenType.CodeStart) {
				nodes.push(...this.parseCodeBlock());
				continue;
			}

			if (peek.type === TokenType.BlockEnd) return nodes;
			if (peek.type === TokenType.BlockElse) return nodes;

			nodes.push({
				type: NodeType.TemplateOutput,
				params: [{
					type: NodeType.LiteralValue,
					value: { type: TokenType.StringLiteral, value: this.source.next().value }
				}],
			});
		}

		if (root) return nodes;
		throw new Error('Unexpected end of file, expected `${:end}`');
	}

	private parseCodeBlock() : Node[] {
		const nodes : Node[] = [];

		while (this.source.hasNext()) {
			const peek = this.source.peek() as Token;

			if (peek.type === TokenType.BlockEnd) return nodes;
			if (peek.type === TokenType.BlockElse) return nodes;

			if (peek.type === TokenType.Identifier) {
				nodes.push(this.parseIdentifier());
				continue;
			}

			const next = this.source.next();
			if (next.type === TokenType.CodeEnd) return nodes;
		}

		return nodes;
	}

	private parseIdentifier() : Node {
		const identifier = this.source.next();
		const peek = this.source.peek() as Token;

		if (peek.type === TokenType.BraceOpen) {
			const functionNode = this.parseFunction(identifier);

			if (this.source.hasNext()) {
				const nextPeek = this.source.peek() as Token;

				if (nextPeek.type === TokenType.Pipe) {
					return this.parsePipeSequence(functionNode);
				}
			}

			return functionNode;
		}

		if (peek.type === TokenType.CodeEnd) {
			return {
				type: NodeType.TemplateOutput,
				params: [{
					type: NodeType.Variable,
					value: identifier,
				}]
			};
		}

		if (peek.type === TokenType.Operator) {
			return {
				type: NodeType.TemplateOutput,
				params: [this.parseExpression(identifier)]
			};
		}

		if (peek.type === TokenType.Pipe) {
			return this.parsePipeSequence({
				type: NodeType.Variable,
				value: identifier,
			});
		}

		if (peek.type === TokenType.BraceClose || peek.type === TokenType.Comma) {
			return {
				type: NodeType.Variable,
				value: identifier,
			};
		}

		throw new Error('Unexpected identifier `' + identifier.value + '`');
	}

	private parseFunction(identifier : Token) : Node {
		if ((this.source.peek() as Token).type === TokenType.BraceOpen) {
			this.source.skip();
		}

		const fn : NodeWithParams = {
			type: NodeType.Function,
			value: identifier,
			params: this.parseBraceGroup()
		};

		if ((this.source.peek() as Token).type === TokenType.BlockStart) {
			this.source.skip(2);
			fn.children = this.parseBlock();

			if ((this.source.peek() as Token).type === TokenType.BlockElse) {
				this.source.skip(2);
				fn.elseChildren = this.parseBlock();
			}

			this.source.skip();
		}

		return fn;
	}

	private parseBraceGroup() : Node[] {
		const tokens : Node[] = [];

		let comma = null;
		while (this.source.hasNext()) {
			const peek = this.source.peek() as Token;

			if (comma === null && peek.type === TokenType.BraceClose) {
				this.source.skip();
				return tokens;
			}

			if (comma) {
				if (peek.type === TokenType.BraceClose) {
					this.source.skip();
					return tokens;
				}

				if (peek.type !== TokenType.Comma) {
					throw new Error('Unexpected `' + peek.value + '`, expected `,`');
				}

				comma = false;
				this.source.skip();

				continue;
			}

			comma = true;

			if (peek.type === TokenType.Identifier) {
				tokens.push(this.parseIdentifier());
				continue;
			}

			if (peek.type === TokenType.BraceOpen) {
				this.source.skip();
				tokens.push({
					type: NodeType.TokenGroup,
					params: this.parseBraceGroup(),
				});
				continue;
			}

			tokens.push({ type: NodeType.LiteralValue, value: this.source.next() });
		}

		return tokens;
	}

	private parseExpression(startIdent : Token) : Node {
		const expr : NodeWithParams = {
			type: NodeType.Expression,
			params: [{
				type: NodeType.Variable,
				value: startIdent,
			}]
		};

		let operator = true;
		while (this.source.hasNext()) {
			if (operator && (this.source.peek() as Token).type === TokenType.CodeEnd) return expr;

			const next = this.source.next();

			if (operator) {
				if (next.type !== TokenType.Operator) {
					throw new Error('Unexpected `' + next.value + '`, expected operator');
				}

				expr.params.push({
					type: NodeType.Operator,
					value: next,
				});

				operator = false;
				continue;
			}

			operator = true;

			if (next.type === TokenType.BraceOpen) {
				expr.params.push(this.parseExpression(this.source.next()));
			}

			const peek = this.source.peek() as Token;

			if (peek.type === TokenType.BraceOpen) {
				expr.params.push(this.parseFunction(next));
				continue;
			}

			if (next.type === TokenType.Identifier) {
				expr.params.push({
					type: NodeType.Variable,
					value: next,
				});
				continue;
			}

			expr.params.push({
				type: NodeType.LiteralValue,
				value: next,
			});
		}

		return expr;
	}

	private parsePipeSequence(startNode : Node) : Node {
		const sequence : NodeWithParams = {
			type: NodeType.PipeSequence,
			params: [startNode]
		};

		let pipe = true;

		while (this.source.hasNext()) {
			const peek = this.source.peek() as Token;

			if (pipe) {
				if (peek.type === TokenType.Pipe) {
					this.source.skip();
					pipe = false;
					continue;
				}

				if (peek.type === TokenType.CodeEnd) {
					return sequence;
				}

				throw new Error('Unexpected token `' + peek.value + '`, expected `|`');
			}

			pipe = true;

			if (peek.type === TokenType.Identifier) {
				const identNode = this.parseIdentifier();

				if (identNode.type === NodeType.PipeSequence) {
					sequence.params.push(...identNode.params as Node[]);
				} else {
					sequence.params.push(identNode);
				}

				continue;
			}

			if (peek.type === TokenType.StringLiteral) {
				sequence.params.push({
					type: NodeType.LiteralValue,
					value: this.source.next(),
				});
				continue;
			}

			throw new Error('Unexpected token `' + peek.value + '`');
		}

		throw new Error('Unexpected end of file');
	}

}
