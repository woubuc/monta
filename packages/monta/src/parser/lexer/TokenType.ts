/**
 * Defines the type of a token in the template code
 */
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
