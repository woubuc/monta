import { createMonta } from './_utils';

test('css', async () => {
	const render = await createMonta().compile('<style>${ get(\'stylesheet.css\') | minify() | inline() }</style>');

	expect(await render()).toBe(`<style>body{color:#333;background:#eee;font-family:sans-serif}</style>`);
});

test('js', async () => {
	const render = await createMonta().compile('<script>${ get(\'script.js\') | minify() | inline() }</script>');

	expect(await render()).toBe(`<script>console.log("hello world");</script>`);
});
