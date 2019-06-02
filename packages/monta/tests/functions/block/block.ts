import Monta from '../../../src';

test('with body', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('body.mt');
	expect(result).toBe('<html>\n<body>\n<p>I have a body</p>\n</body>\n</html>');
});

test('without body', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('no-body.mt');
	expect(result).toBe('<html>\n<body>\n\t<p>I have no body</p>\n</body>\n</html>');
});

test('footer', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('footer.mt');
	expect(result).toBe('<html>\n<body>\n<p>I have a body</p>\n<p>And a footer</p>\n</body>\n</html>');
});
