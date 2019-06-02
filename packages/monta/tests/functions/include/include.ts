import Monta from '../../../src';

test('include', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const result = await monta.renderFile('base.mt');
	expect(result).toBe('<html>\n<body>\n\t<p>I am included</p>\n</body>\n</html>');
});
