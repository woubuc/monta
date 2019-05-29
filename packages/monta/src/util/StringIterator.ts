import { Iterator } from './Iterator';

export class StringIterator extends Iterator<string> {
	public constructor(source : string) {
		super(source.split(''));
	}

	public peekMatch(matcher : string) : boolean {
		return super.peekMatch(matcher.split(''));
	}
}
