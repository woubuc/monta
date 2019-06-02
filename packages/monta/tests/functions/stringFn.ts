import Monta from '../../src';

test('trim', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ foo | trim() }</p>');

	expect(await render({ foo: '   bar  ' })).toBe('<p>bar</p>');
	expect(await render({ foo: 'bar  ' })).toBe('<p>bar</p>');
	expect(await render({ foo: '   bar' })).toBe('<p>bar</p>');
	expect(await render({ foo: 'bar' })).toBe('<p>bar</p>');
});

test('upper', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ foo | upper() }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>BAR</p>');
	expect(await render({ foo: 'BaR' })).toBe('<p>BAR</p>');
	expect(await render({ foo: 'BAR' })).toBe('<p>BAR</p>');
});

test('lower', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ foo | lower() }</p>');

	expect(await render({ foo: 'BAR' })).toBe('<p>bar</p>');
	expect(await render({ foo: 'BaR' })).toBe('<p>bar</p>');
	expect(await render({ foo: 'bar' })).toBe('<p>bar</p>');
});

test('padLeft', async () => {
	const monta = new Monta();

	expect(await monta.render(
		'<p>${ foo | padLeft(5) }</p>',
		{ foo: 'bar' },
		)).toBe('<p>  bar</p>');

	expect(await monta.render(
		'<p>${ foo | padLeft(3) }</p>',
		{ foo: 'bar' },
		)).toBe('<p>bar</p>');

	expect(await monta.render(
		'<p>${ foo | padLeft(1) }</p>',
		{ foo: 'bar' },
		)).toBe('<p>bar</p>');
});

test('padRight', async () => {
	const monta = new Monta();

	expect(await monta.render(
		'<p>${ foo | padRight(5) }</p>',
		{ foo: 'bar' },
	)).toBe('<p>bar  </p>');

	expect(await monta.render(
		'<p>${ foo | padRight(3) }</p>',
		{ foo: 'bar' },
	)).toBe('<p>bar</p>');

	expect(await monta.render(
		'<p>${ foo | padRight(1) }</p>',
		{ foo: 'bar' },
	)).toBe('<p>bar</p>');
});
