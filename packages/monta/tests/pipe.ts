import Monta from '../src';

test('single pipe', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo | trim() }</p>',
		{ foo: '  bar '}
		);
	expect(result).toBe('<p>bar</p>');
});

test('multiple pipe', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo | trim() | upper() }</p>',
		{ foo: '  bar '}
		);
	expect(result).toBe('<p>BAR</p>');
});
