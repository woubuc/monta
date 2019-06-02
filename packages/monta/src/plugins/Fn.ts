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
	args : any[];

	/** Current rendering context */
	ctx : Context;

	/** Current function node in the AST */
	node : Node;

	/** Input piped to function, or undefined */
	input ?: any;

	/** Block nodes, if the function has a block */
	block ?: Node[];

	/** Block nodes in the else block, if the function has an else block */
	elseBlock ?: Node[];
}

/**
 * Configuration options for registering a template function
 */
export interface FnConfig {
	pipeable : boolean;
	block : boolean;
	elseBlock : boolean;

	maxArgs : number;
	requiredArgs : number;
}

function register(target : FnMap, name : string, exec : Fn, config : Partial<FnConfig> = {}) : void {
	target.set(name, {
		exec,

		pipeable: target === fns && (config.pipeable || false),
		block: config.block || false,
		elseBlock: config.elseBlock || false,

		requiredArgs: config.requiredArgs || 0,
		maxArgs: Math.max(config.maxArgs || 0, config.requiredArgs || 0),
	});
}

export function registerFn(name : string, exec : Fn, config ?: Partial<FnConfig>) : void {
	register(fns, name, exec, config);
}
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
