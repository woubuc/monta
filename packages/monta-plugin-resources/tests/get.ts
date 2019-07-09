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

test('glob', async () => {
	const render = await createMonta().compile("${ get('*.(png|css)') }");

	expect(await render()).toBe('[resource:image.png][resource:stylesheet.css]');
});

test('invalid path', async () => {
	const render = await createMonta().compile("${ get('i-dont-exist.jpg') }");

	await expect(render()).rejects.toThrow('No files found that match');
});

test('template', async () => {
	const render = await createMonta().compileFile('template/get.mt');

	expect(await render({ path: '../image.png' })).toBe('[resource:image.png]');
	expect(await render({ path: '../stylesheet.css' })).toBe('[resource:stylesheet.css]');
});
