import { createMonta, read } from './_utils';

test('text', async () => {
	const render = await createMonta().compile('<link rel="stylesheet" href="${ get(\'stylesheet.css\') | toUrl() }">');

	// The filename is a hash of the file, so as long as the file doesn't change the hash shouldn't change either
	const hash = '1160fc23ee2074c02bc916242965ca13';

	expect(await render()).toBe(`<link rel="stylesheet" href="/${ hash }.css">`);
	expect(await read(`output/${ hash }.css`)).toBe(await read('stylesheet.css'));
});

test('image', async () => {
	const render = await createMonta().compile('<img src="${ get(\'image.png\') | toUrl() }">');

	const hash = 'd157a549b6c804a1f56120becea71a19';

	expect(await render()).toBe(`<img src="/${ hash }.png">`);
	expect(await read(`output/${ hash }.png`)).toBe(await read('image.png'));
});
