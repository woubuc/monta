import { compileFile } from '../../../src';
import path from "path";

test('with body', async () => {
	const template = await compileFile(path.join(__dirname, 'body.mt'));

	expect(await template.render()).toBe(`<html>\n<body>\n<p>I have a body</p>\n</body>\n</html>`);
});

test('without body', async () => {
	const template = await compileFile(path.join(__dirname, 'no-body.mt'));

	expect(await template.render()).toBe(`<html>\n<body>\n\t<p>I have no body</p>\n</body>\n</html>`);
});

test('footer', async () => {
	const template = await compileFile(path.join(__dirname, 'footer.mt'));

	expect(await template.render()).toBe(`<html>\n<body>\n<p>I have a body</p>\n<p>And a footer</p>\n</body>\n</html>`);
});
