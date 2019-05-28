import { compileFile } from '../../../src';
import path from "path";

test('include', async () => {
	const template = await compileFile(path.join(__dirname, 'base.mt'));

	expect(await template.render()).toBe(
		`<html>
<body>
	<p>I am included</p>
</body>
</html>`);
});
