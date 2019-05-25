import { compileFile } from '../../src';
import path from "path";

test('file', async () => {
	const template = await compileFile(path.join(__dirname, 'file.mt'));

	expect(await template.render()).toBe(`<p>${ path.join(__dirname, 'file.mt') }</p>`);
});

test('filename.mt', async () => {
	const template = await compileFile(path.join(__dirname, 'filename.mt'));

	expect(await template.render()).toBe('<p>filename.mt</p>');
});

test('path', async () => {
	const template = await compileFile(path.join(__dirname, 'path.mt'));

	expect(await template.render()).toBe(`<p>${ __dirname }</p>`);
});
