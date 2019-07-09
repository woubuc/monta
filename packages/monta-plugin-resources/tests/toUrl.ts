import { createMonta, read } from './_utils';

test('toUrl', async () => {
	const render = await createMonta().compile('<img src="${ get(\'stylesheet.css\') | toUrl() }">');

	// The filename is a hash of the file, so as long as the file doesn't change the hash shouldn't change either
	const hash = '1160fc23ee2074c02bc916242965ca13';

	expect(await render()).toBe(`<img src="/${ hash }.css">`);
	expect(await read(`output/${ hash }.css`)).toBe(await read('stylesheet.css'));
});
