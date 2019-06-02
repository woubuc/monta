import { TokenType } from './TokenType';

/**
 * A single token in the template code, containing a
 * string value of one or more characters
 */
export interface Token {
	type : TokenType;
	value : string;
}
