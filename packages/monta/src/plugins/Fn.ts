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
	 * Note: pre & post functions can never be pipeable
	 *
	 * TODO validate this before calling function
	 *
	 * @default true
	 */
	pipeable : boolean;

	/**
	 * Whether this function requires piped input
	 *
	 * TODO validate this before calling function
	 *
	 * @default false
	 */
	pipeRequired : boolean;

	/**
	 * Whether this function can receive a block of child nodes
	 *
	 * TODO validate this before calling function
	 *
	 * @default false
	 */
	block : boolean;

	/**
	 * Whether this function requires a block of child nodes
	 *
	 * TODO validate this before calling function
	 *
	 * @default false
	 */
	blockRequired : boolean;

	/**
	 * Whether this function can receive an 'else' block of child nodes
	 *
	 * If true, `block` will be set to true as well
	 *
	 * TODO validate this before calling function
	 *
	 * @default false
	 */
	elseBlock : boolean;

	/**
	 * Whether this function requires an 'else' block of child nodes
	 *
	 * TODO validate this before calling function
	 *
	 * @default false
	 */
	elseBlockRequired : boolean;

	/**
	 * Maximum number of arguments passed
	 *
	 * If omitted, will be equal to `requiredArgs`
	 *
	 * TODO validate this before calling function
	 */
	maxArgs : number;

	/**
	 * Minimum number of arguments passed
	 *
	 * TODO validate this before calling function
	 *
	 * @default 0
	 */
	requiredArgs : number;
}

function register(target : FnMap, name : string, exec : Fn, config : Partial<FnConfig> = {}) : void {
	target.set(name, {
		exec,

		pipeable: target === fns && (config.pipeRequired || config.pipeable !== false),
		pipeRequired: target === fns && (config.pipeRequired || false),

		block: config.block || config.elseBlock || false,
		blockRequired: config.blockRequired || config.elseBlockRequired || false,
		elseBlock: config.elseBlock || false,
		elseBlockRequired: config.elseBlockRequired || false,

		requiredArgs: config.requiredArgs || 0,
		maxArgs: Math.max(config.maxArgs || 0, config.requiredArgs || 0),
	});
}

export const registerFn = (name : string, exec : Fn, config ?: Partial<FnConfig>) : void => {
	register(fns, name, exec, config);
};
export function registerPre(name : string, exec : Fn, config ?: Partial<FnConfig>) : void {
	register(pres, name, exec, config);
}
export function registerPost(name : string, exec : Fn, config ?: Partial<FnConfig>) : void {
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
