import { Node } from './parser/Parser';
import block from './functions/block';
import include from './functions/include';

export interface FnDef {
	pipeInto? : boolean;
	pipeOut? : boolean;

	/** Set to true if this function should only be executed after all template parsing */
	runAfter? : boolean;

	/** Runs during rendering, even if `runAfter` is set to true */
	before? : (ctx : any, params : any[]) => Promise<void>;

	name : string;
	exec : (ctx : any, params : any[], block? : Node[], elseBlock? : Node[]) => Promise<any>;
}

const defaultFnDef : Partial<FnDef> = {
	runAfter: false,
	pipeInto: false,
	pipeOut: false,
};

async function loadDefs() : Promise<FnDef[]> {
	const defs : any[] = [block, include];

	return defs
		.reduce((acc, defs) => {
			if (Array.isArray(defs)) acc.push(...defs);
			else acc.push(defs);
			return acc;
		}, [])
		.filter((def : Partial<FnDef>) => {
			if (def.name == undefined) {
				console.warn('Missing `name` in function definition');
				return false;
			}

			if (def.exec == undefined) {
				console.warn('Missing `exec` in function definition for ' + def.name);
				return false;
			}

			return true;
		});
}

let functions : Map<string, FnDef> | undefined = undefined;

export async function loadFunctions() : Promise<Map<string, FnDef>> {
	if (functions == undefined) {
		const fns = new Map<string, FnDef>();

		const defs = await loadDefs();

		for (const def of defs) {
			fns.set(def.name, Object.assign({}, defaultFnDef, def));
		}

		functions = fns;
	}

	return functions;
}
