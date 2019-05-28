import { Iterator } from '../util/Iterator';

export enum TokenType {
	PlainText,
	CodeStart,
	CodeEnd,

	Identifier,
	Operator,
	Comma,

	BraceOpen,
	BraceClose,
	BlockStart,
	BlockElse,
	BlockEnd,

	StringLiteral,
	NumberLiteral,
}

export interface Token {
	type : TokenType;
	value : string;
}

const KEYWORD_START = /[a-zA-Z_$]/;
const KEYWORD = /[a-zA-Z0-9_$.]/;
const STRING_DELIMITERS = Object.freeze([`'`, `"`]);
const NUMBER_START = /[0-9.]/;
const NUMBER = /[0-9_.]/;
const SINGLE_CHARS : { [k : string] : TokenType } = Object.freeze({
	'(': TokenType.BraceOpen,
	')': TokenType.BraceClose,
	'+': TokenType.Operator,
	'-': TokenType.Operator,
	'*': TokenType.Operator,
	'/': TokenType.Operator,
	'%': TokenType.Operator,
	',': TokenType.Comma,
});

export default class Lexer {

	private readonly source : Iterator<string>;

	private tokens : Token[] = [];

	public constructor(html : string) {
		this.source = new Iterator(html.split(''));
	}

	public run() : Token[] {
		while (this.source.hasNext()) {
			let value = '';

			while (this.source.hasNext()) {
				const next = this.source.next();

				if (next === '$' && this.source.peek() === '{') {
					this.tokens.push({ type: TokenType.PlainText, value: value });
					value = '';

					this.source.skip();
					this.tokens.push({ type: TokenType.CodeStart, value: '${' });

					this.parseCodeBlock();

					break;
				}

				value += next;
			}

			this.tokens.push({ type: TokenType.PlainText, value: value });
		}

		return this.tokens.filter(t => t.value.length > 0);
	}

	private parseCodeBlock() {
		this.skipWhitespace();

		if (this.matchPeek(':else:')) {
			this.tokens.push({ type: TokenType.BlockElse, value: ':else:' });
			this.source.skip(6);

			this.skipWhitespace();

			let peek = this.source.peek();
			if (peek == undefined) throw new Error('Unexpected end of file, expected `}`');
			if (peek !== '}') throw new Error('Unexpected `' + peek + '`, expected `}`');

			this.tokens.push({ type: TokenType.CodeEnd, value: '}' });
			this.source.skip();
			return;
		}

		if (this.matchPeek(':end')) {
			this.tokens.push({ type: TokenType.BlockEnd, value: ':end' });
			this.source.skip(4);

			this.skipWhitespace();

			let peek = this.source.peek();
			if (peek == undefined) throw new Error('Unexpected end of file, expected `}`');
			if (peek !== '}') throw new Error('Unexpected `' + peek + '`, expected `}`');

			this.tokens.push({ type: TokenType.CodeEnd, value: '}' });
			this.source.skip();
			return;
		}

		while (this.source.hasNext()) {
			this.skipWhitespace();

			const next = this.source.next();

			if (next === '}') {
				this.tokens.push({ type: TokenType.CodeEnd, value: '}' });
				return;
			}

			if (next === '{') {
				this.parseCodeBlock();
				continue;
			}

			if (next === ':') {
				const peek = this.source.peek();
				if (peek == undefined) throw new Error('Unexpected end of file, expected `}`');
				if (peek !== '}') {
					const nextPeek = this.source.peek(1);
					if (peek !== ' ' || !nextPeek || nextPeek !== '}') {
						throw new Error('Unexpected `' + peek + '`, expected `}`');
					}

					this.source.skip();
				}

				this.source.skip();
				this.tokens.push({ type: TokenType.BlockStart, value: ':' });
				this.tokens.push({ type: TokenType.CodeEnd, value: '}' });
				return;
			}

			if (SINGLE_CHARS[next] != undefined) {
				this.tokens.push({ type: SINGLE_CHARS[next], value: next });
				continue;
			}

			if (STRING_DELIMITERS.includes(next)) {
				this.tokens.push({ type: TokenType.StringLiteral, value: this.getStringLiteral(next) });
				continue;
			}

			if (NUMBER_START.test(next)) {
				this.tokens.push({ type: TokenType.NumberLiteral, value: this.getNumberLiteral(next) });
				continue;
			}

			if (KEYWORD_START.test(next)) {
				this.tokens.push({ type: TokenType.Identifier, value: this.getKeyword(next) });
				continue;
			}

			throw new Error('Unexpected `' + next + '`');
		}

		throw new Error('Unexpected end of file, expected `}`');
	}

	private getKeyword(startChar : string) : string {
		let value = startChar;

		while (this.source.hasNext()) {
			if (!KEYWORD.test(this.source.peek() as string)) break;
			value += this.source.next();
		}

		return value;
	}

	private getStringLiteral(delimiterChar : string) : string {
		let value = '';

		while (this.source.hasNext()) {
			const next = this.source.next();

			if (next === delimiterChar) return value;

			if (next === '\\') {
				value += this.source.next();
				continue;
			}

			value += next;
		}

		throw new Error('Unexpected end of file, expected `' + delimiterChar + '`');
	}

	private getNumberLiteral(startChar : string) : string {
		let value = startChar;

		while (this.source.hasNext()) {
			if (!NUMBER.test(this.source.peek() as string)) break;
			value += this.source.next();
		}

		return value;
	}

	private skipWhitespace() {
		while (this.source.hasNext()) {
			const peek = this.source.peek();
			if (!peek) return;

			if (/\s/.test(peek)) this.source.skip();
			else return;
		}
	}

	private matchPeek(value : string) : boolean {
		for (let i = 0; i < value.length; i++) {
			const peek = this.source.peek(i);

			if (peek == undefined) return false;
			if (peek !== value.charAt(i)) return false;
		}
		return true;
	}

}
