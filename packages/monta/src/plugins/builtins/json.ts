import { MontaPlugin } from '../index';

export default function(plugin : MontaPlugin<unknown>) : void {

	plugin.registerFn('json',
		({ args, input }) => JSON.stringify(input ? input.value : args[0].value),
		{ maxArgs: 1 });

}
