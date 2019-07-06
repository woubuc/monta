import { MontaPlugin } from '../index';

export default function(plugin : MontaPlugin) : void {

	plugin.registerFn('trim',
		({ args, input }) => trim(input ? input.value : args[0].value) ,
		{ pipeable: true, maxArgs: 1 });

	plugin.registerFn('upper',
		({ args, input }) => upper(input ? input.value : args[0].value) ,
		{ pipeable: true, maxArgs: 1 });

	plugin.registerFn('lower',
		({ args, input }) => lower(input ? input.value : args[0].value) ,
		{ pipeable: true, maxArgs: 1 });

	plugin.registerFn('padRight',
		({ args, input }) => input ? padRight(input.value, args[0].value) : padRight(args[0].value, args[1].value),
		{ pipeable: true, requiredArgs: 1, maxArgs: 2 });

	plugin.registerFn('padLeft',
		({ args, input }) => input ? padLeft(input.value, args[0].value) : padLeft(args[0].value, args[1].value),
		{ pipeable: true, requiredArgs: 1, maxArgs: 2 });
}

function trim(str ?: string) : string {
	if (!str) return '';
	return str.trim();
}

function upper(str ?: string) : string {
	if (!str) return '';
	return str.toUpperCase();
}

function lower(str ?: string) : string {
	if (!str) return '';
	return str.toLowerCase();
}

function padRight(str ?: string, length ?: number) : string {
	if (!str) return '';
	if (!length) return str;

	return str + ' '.repeat(Math.max(0, length - str.length));
}

function padLeft(str ?: string, length ?: number) : string {
	if (!str) return '';
	if (!length) return str;

	return ' '.repeat(Math.max(0, length - str.length)) + str;
}
