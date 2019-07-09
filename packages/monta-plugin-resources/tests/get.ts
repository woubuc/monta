import { createMonta } from './_utils';

test('literal', async () => {
	const render = await createMonta().compile("${ get('stylesheet.css') }");

	expect(await render()).toBe('[resource:stylesheet.css]');
});

test('variable', async () => {
	const render = await createMonta().compile("${ get(css) }");

	expect(await render({ css: 'stylesheet.css' })).toBe('[resource:stylesheet.css]');
});

test('pipe', async () => {
	const render = await createMonta().compile("${ css | get() }");

	expect(await render({ css: 'stylesheet.css' })).toBe('[resource:stylesheet.css]');
});
