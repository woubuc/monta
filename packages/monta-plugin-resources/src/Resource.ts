import { Readable, Transform, PassThrough, Stream } from 'stream';
import { createReadStream, createWriteStream } from 'fs-extra';
import { createHash } from 'crypto';
import path from 'path';

import { Context } from 'monta';

/**
 * An individual resource identifier
 *
 * At its core, a resource is simply a stream containing data
 * from the original resource file. This stream can be piped
 * through any number of transforms using the `transform()`
 * function, and can finally be finalised through the
 * `collect()` or `save()` functions.
 */
export interface Resource {

	/**
	 * Path to the directory containing the original resource
	 */
	readonly path : string;

	/**
	 * Filename of the resource, without file extension
	 */
	filename : string;

	/**
	 * File extension of the resource
	 *
	 * Transform functions should use this extension to determine
	 * the type of the resource. If a function changes the type
	 * (e.g. by compiling a resource into a different language),
	 * it should change the `ext` here.
	 *
	 * This is also the extension given to the output file.
	 */
	ext : string;

	/**
	 * Runs the resource through a transform function
	 *
	 * @param transform - The stream transform to use
	 */
	transform(transform : Transform) : void;

	/**
	 * Collects the resource data and returns it
	 */
	collect() : Promise<Buffer>;

	/**
	 * Saves the resource into the configured directory
	 *
	 * @param outDir  - Directory to output to
	 * @param baseUrl - Base URL of the public path
	 *
	 * @returns The full public path to the resource
	 *          (baseUrl + generated filename)
	 */
	save(outDir : string, baseUrl : string) : Promise<string>;

	/**
	 * Returns a simple string identifier of the resource
	 */
	toString() : string;
}

export class Res implements Resource {

	public filename : string;
	public path : string;
	public ext : string;

	/** Whether this file resource is still open */
	private open : boolean;

	/** The resource stream */
	private stream : Readable;

	/**
	 * Creates a resource
	 *
	 * @param ctx  - The current rendering context
	 * @param file - Filename and path of the file
	 */
	public constructor(ctx : Context, file : string) {
		this.open = true;

		this.path = path.dirname(file);
		this.filename = path.basename(file, path.extname(file));
		this.ext = path.extname(file).replace('.', '');

		const filePath = ctx.meta.path;
		const rootDir = ctx.options.templateRoot;
		this.stream = createReadStream(path.resolve(rootDir, filePath, file));
	}

	public transform(transform : Transform) : void {
		if (!this.open) throw new Error('Cannot transform, resource already saved');

		this.stream = this.stream.pipe(transform);
	}

	public collect() : Promise<Buffer> {
		if (!this.open) throw new Error('Cannot collect, resource already saved');
		this.open = false;

		return new Promise(resolve => {
			const chunks : any[] = [];
			this.stream.on('data', chunk => chunks.push(chunk));
			this.stream.on('end', () => {
				resolve(Buffer.concat(chunks));
			});
		});
	}

	public async save(outDir : string, baseUrl : string) : Promise<string> {
		if (!this.open) throw new Error('Cannot save, resource already saved');
		this.open = false;

		const [hashStream, saveStream] = clone(this.stream);

		const hash = createHash('md5').setEncoding('hex');
		await awaitEvt(hashStream.pipe(hash), 'finish');

		const name = [hash.read(), this.ext].join(this.ext.startsWith('.') ? '' : '.');
		await awaitEvt(saveStream.pipe(createWriteStream(path.join(outDir, name))), 'close');

		return [baseUrl, name].join(baseUrl.endsWith('/') ? '' : '/');
	}

	public toString() : string {
		return `[resource:${ this.filename }.${ this.ext }]`;
	}
}

/**
 * Helper to promisify events
 */
function awaitEvt(stream : Stream, evtName : string) : Promise<void> {
	return new Promise(resolve => stream.once(evtName, () => resolve()));
}

/**
 * Clones a single stream into two streams, both containing
 * the data of the original stream
 */
function clone(stream : Stream) : [Stream, Stream] {
	const a = new PassThrough();
	const b = new PassThrough();

	stream.on('data', chunk => {
		a.push(chunk);
		b.push(chunk);
	});

	stream.on('end', () => {
		a.push(null);
		b.push(null);
	});

	return [a, b];
}
