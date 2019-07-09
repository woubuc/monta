import { createMonta, read } from './_utils';

test('url', async () => {
	const render = await createMonta().compile('<link href="${ get(\'*.css\') | concat(\'style.css\') | toUrl() }">');

	const hash = 'a68ea440c6cba57b44f8c61d93da60d0';

	expect(await render()).toBe(`<link href="/${ hash }.css">`);
});

test('inline', async () => {
	const render = await createMonta().compile('<style type="text/css">${ get(\'*.css\') | concat(\'style.css\') | inline() }</style>');

	expect(await render()).toBe(`<style type="text/css">${ await read('stylesheet.css') }${ await read('stylesheet2.css') }</style>`);
});
