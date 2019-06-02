import minimist from 'minimist';
import path from 'path';

/**
 * Options for the CLI
 */
export interface CliOptions {
	/** List of globs to load */
	globs : string[];

	/** Base path for templates */
	root : string;

	/** Output directory */
	out : string;

	/** List of extensions to accept */
	extensions : string[];

	/** Enable or disable verbose logging */
	verbose : boolean;
}

/** Default directory to place generated files */
const DEFAULT_OUT = './dist';

/** The CLI will look for these extensions if no --ext flag is given */
const DEFAULT_EXT = ['.mt', '.html'];

/**
 * Parses the CLI options
 *
 * @param argv - The process.argv string array to parse
 */
export function parseOptions(argv : string[]) : CliOptions {
	const args = minimist(argv);

	return {
		globs: args._,
		root: path.resolve(args.root || process.cwd()),
		out: path.resolve(args.out || DEFAULT_OUT),
		extensions: getExt(args.ext),
		verbose: !!args.verbose,
	};
}

/**
 * Parses the file extensions given
 *
 * @param ext - `ext` property of args
 */
function getExt(ext ?: string) : string[] {
	if (!ext) return DEFAULT_EXT;

	let exts : string[] = Array.isArray(ext) ? ext : ext.split(',');
	return exts.map((e : string) => e.startsWith('.') ? e : `.${ e }`);
}
