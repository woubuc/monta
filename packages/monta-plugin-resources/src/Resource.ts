import { Readable, Transform } from 'stream';
import { createWriteStream } from 'fs-extra';
import { createHash } from 'crypto';
import path from 'path';

import { awaitEvt, cloneStream } from './utils/streamUtils';

/**
 * An individual resource identifier
 *
 * At its core, a resource is simply a stream containing data
 * from the original resource file. This stream can be piped
 * through any number of transforms using the `transform()`
 * function, and can finally be finalised through the
 * `collect()` or `save()` functions.
 */
export class Resource {

	/**
	 * Path to the directory containing the original resource
	 */
	public path : string;

	/**
	 * Filename of the resource, without file extension
	 */
	public filename : string;

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
	public ext : string;

	/**
	 * The full file name, including extension
	 */
	public get file() : string { return [this.filename, this.ext].join('.') }

	/** The resource stream */
	private stream ?: Readable;

	/**
	 * Creates a resource
	 *
	 * @param file - Filename and path of the file
	 * @param stream   - Stream with the file contents
	 */
	public constructor(file : string, stream ?: Readable) {
		this.path = path.dirname(file);
		this.filename = path.basename(file, path.extname(file));
		this.ext = path.extname(file).replace('.', '');

		if (stream) {
			this.stream = stream;
		}
	}

	/**
	 * Runs the resource through a transform function
	 *
	 * @param transform - The stream transform to use
	 */
	public transform(transform : Transform) : void {
		if (!this.stream) throw new Error('Cannot transform, resource already saved');

		this.stream = this.stream.pipe(transform);
	}

	/**
	 * Collects the resource data and returns it
	 */
	public collect() : Promise<Buffer> {
		return new Promise(resolve => {
			if (!this.stream) throw new Error('Cannot collect, resource already saved');

			const chunks : any[] = [];
			this.stream.on('data', chunk => chunks.push(chunk));
			this.stream.on('end', () => {
				resolve(Buffer.concat(chunks));
			});
		});
	}

	/**
	 * Saves the resource into the configured directory
	 *
	 * @param outDir  - Directory to output to
	 * @param baseUrl - Base URL of the public path
	 *
	 * @returns The full public path to the resource
	 *          (baseUrl + generated filename)
	 */
	public async save(outDir : string, baseUrl : string) : Promise<string> {
		if (!this.stream) throw new Error('Cannot save, resource already saved');

		const [hashStream, saveStream] = cloneStream(this.stream);

		const hash = createHash('md5').setEncoding('hex');
		await awaitEvt(hashStream.pipe(hash), 'finish');

		const name = [hash.read(), this.ext].join(this.ext.startsWith('.') ? '' : '.');
		await awaitEvt(saveStream.pipe(createWriteStream(path.join(outDir, name))), 'close');

		return [baseUrl, name].join(baseUrl.endsWith('/') ? '' : '/');
	}

	/**
	 * Gets the stream from the resource
	 */
	public toStream() : Readable {
		if (!this.stream) throw new Error('Cannot get stream, resource already saved');

		const stream = this.stream;
		this.stream = undefined;
		return stream;
	}

	/**
	 * Returns a simple string identifier of the resource
	 */
	public toString() : string {
		return `[resource:${ this.filename }.${ this.ext }]`;
	}
}

