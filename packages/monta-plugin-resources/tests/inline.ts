import { createMonta, read } from './_utils';

test('text file', async () => {
	const render = await createMonta().compile('<style type="text/css">${ get(\'stylesheet.css\') | inline() }</style>');

	expect(await render()).toBe(`<style type="text/css">${ await read('stylesheet.css') }</style>`);
});

test('binary file', async () => {
	const render = await createMonta().compile('<img src="${ get(\'image.png\') | inline() }">');

	expect(await render()).toBe(`<img src="data:image/png;base64,${ await read('image.png', 'base64') }">`);
});
