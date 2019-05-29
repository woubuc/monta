import { Iterator } from '../util/Iterator';
import { TokenType } from './lexer/TokenType';
import { Token } from './lexer/Token';

export enum NodeType {
	TemplateOutput,
	TokenGroup,
	Function,
	Expression,
	Variable,
	Operator,
	LiteralValue,
}

export interface Node {
	type : NodeType;

	value? : Token;

	params? : Node[];
	children? : Node[];
	elseChildren? : Node[];
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
			return this.parseFunction(identifier);
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
			return this.parseExpression(identifier);
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
				this.source.skip();
				fn.elseChildren = this.parseBlock();
			}

			this.source.skip();
		}

		return fn;
	}

	private parseBraceGroup() : Node[] {
		const tokens : Node[] = [];

		let comma = false;
		while (this.source.hasNext()) {
			const next = this.source.next();

			if (comma) {
				if (next.type === TokenType.BraceClose) return tokens;

				if (next.type !== TokenType.Comma) {
					throw new Error('Unexpected `' + next.value + '`, expected `,`');
				}

				comma = false;
				continue;
			}

			comma = true;

			if (next.type === TokenType.Identifier) {
				tokens.push(this.parseIdentifier());
				continue;
			}

			if (next.type === TokenType.BraceOpen) {
				tokens.push({
					type: NodeType.TokenGroup,
					params: this.parseBraceGroup(),
				} as NodeWithParams);
				continue;
			}

			tokens.push({ type: NodeType.LiteralValue, value: next });
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

}
