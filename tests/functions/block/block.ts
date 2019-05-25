import { compileFile } from '../../../src';
import path from "path";

test('with body', async () => {
	const template = await compileFile(path.join(__dirname, 'body.mt'));

	expect(await template.render()).toBe(
		`<html>
<body>
	<p>I have a body</p>
</body>
</html>`);
});

test('without body', async () => {
	const template = await compileFile(path.join(__dirname, 'no-body.mt'));

	expect(await template.render()).toBe(
		`<html>
<body>
	<p>I have no body</p>
</body>
</html>`);
});

test('footer', async () => {
	const template = await compileFile(path.join(__dirname, 'footer.mt'));

	expect(await template.render()).toBe(
		`<html>
<body>
	<p>I have a body</p>
	<p>And a footer</p>
</body>
</html>`);
});
