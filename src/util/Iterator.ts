export class Iterator<T> {

	private readonly source: T[];
	private cursor : number = 0;

	/**
	 * Create an iterator
	 *
	 * @param source - The source data
	 */
	public constructor(source: T[]) {
		this.source = source;
	}

	/**
	 * Checks if the source data has remaining entries left
	 */
	public hasNext() : boolean {
		return this.source.length > this.cursor;
	}

	/**
	 * Returns the next entry and advances the cursor
	 */
	public next() : T {
		if (this.cursor === this.source.length) throw new Error('Iterator is empty');
		const next = this.source[this.cursor] as T;
		this.cursor++;
		return next;
	}

	/**
	 * Advances the cursor without returning characters
	 * @param count - Number of characters to skip
	 */
	public skip(count: number = 1) {
		for (let i = 0; i < count; i++) {
			this.next();
		}
	}

	/**
	 * Returns the next entry without advancing the cursor
	 *
	 * @param offset - Number of entries to step ahead
	 */
	public peek(offset : number = 0) : T | undefined {
		if (this.cursor + offset >= this.source.length) return undefined;
		return this.source[this.cursor + offset];
	}
}
