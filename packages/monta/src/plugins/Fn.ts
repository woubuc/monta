import { Context } from '../Context';
import { Node } from '..';

type FnMap = Map<string, FnConfig & { exec : Fn }>;

const pres : FnMap = new Map();
const fns : FnMap = new Map();
const posts : FnMap = new Map();

/**
 * Function signature of a Monta template function
 */
export type Fn = (options : FnArgs) => Promise<any> | any;

/**
 * Args passed to a function when it's called
 */
export interface FnArgs {
	/** Function arguments */
	args : FnInput[];

	/** Current rendering context */
	ctx : Context;

	/** Current function node in the AST */
	node : Node;

	/** Input piped to function, or undefined */
	input ?: FnInput;

	/** Block nodes, if the function has a block */
	block ?: Node[];

	/** Block nodes in the else block, if the function has an else block */
	elseBlock ?: Node[];
}

/**
 * An input value (function argument or piped) given to a function
 */
export interface FnInput {
	/** Identifier or undefined if literal value was passed */
	ident ?: string;

	/** The value */
	value : any;
}

/**
 * Configuration options for registering a template function
 */
export interface FnConfig {
	/**
	 * Whether this function can receive piped input
	 *
	 * @default true
	 */
	pipeable : boolean;

	/**
	 * Whether this function expects a block
	 */
	block : boolean;

	/**
	 * Whether this function expects an else block
	 */
	elseBlock : boolean;

	/**
	 * Maximum number of arguments passed
	 *
	 * If omitted, will be equal to `requiredArgs`
	 */
	maxArgs : number;

	/**
	 * Minimum number of arguments passed
	 *
	 * @default 0
	 */
	requiredArgs : number;
}

function register(target : FnMap, name : string, exec : Fn, config : Partial<FnConfig> = {}) : void {
	target.set(name, {
		exec,

		pipeable: target === fns && config.pipeable !== false,
		block: config.block || false,
		elseBlock: config.elseBlock || false,

		requiredArgs: config.requiredArgs || 0,
		maxArgs: Math.max(config.maxArgs || 0, config.requiredArgs || 0),
	});
}

export const registerFn = (name : string, exec : Fn, config ?: Partial<FnConfig>) : void => {
	register(fns, name, exec, config);
};
export function registerPre(name : string, exec : Fn, config ?: Partial<Exclude<FnConfig, 'pipeable'>>) : void {
	register(pres, name, exec, config);
}
export function registerPost(name : string, exec : Fn, config ?: Partial<Exclude<FnConfig, 'pipeable'>>) : void {
	register(posts, name, exec, config);
}


export const hasFn = (name : string) : boolean => fns.has(name);
export const hasPre = (name : string) : boolean => pres.has(name);
export const hasPost = (name : string) : boolean => posts.has(name);

async function exec(src : FnMap, name : string, args : FnArgs) : Promise<any> {
	const fn = src.get(name);
	if (!fn) throw new Error('Function `' + name + '` does not exist');

	return Promise.resolve(fn.exec(args));
}
export const execFn = (name : string, args : FnArgs) : Promise<any> => exec(fns, name, args);
export const execPre = (name : string, args : FnArgs) : Promise<any> => exec(pres, name, args);
export const execPost = (name : string, args : FnArgs) : Promise<any> => exec(posts, name, args);
