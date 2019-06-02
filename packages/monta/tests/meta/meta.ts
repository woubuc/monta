import path from 'path';

import Monta from '../../src';

test('file', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('file.mt');
	expect(result).toBe(`<p>${ path.join(__dirname, 'file.mt') }</p>`);
});

test('filename.mt', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('filename.mt');
	expect(result).toBe('<p>filename.mt</p>');
});

test('path', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('path.mt');
	expect(result).toBe(`<p>${ __dirname }</p>`);
});
