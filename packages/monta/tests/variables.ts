import Monta from '../src';

test('string', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo }</p>',
		{ foo: 'bar' },
	);
	expect(result).toBe('<p>bar</p>');
});

test('number', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo }</p>',
		{ foo: 42 },
	);
	expect(result).toBe('<p>42</p>');
});

test('multiple variables', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo }, ${ bar }, ${ baz }</p>',
		{ foo: 'one', bar: 'two', baz: 3 },
	);
	expect(result).toBe('<p>one, two, 3</p>');
});

test('path', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo.bar }</p>',
		{ foo: { bar: 'baz' } },
	);
	expect(result).toBe('<p>baz</p>');
});

test('deep path', async () => {
	const monta = new Monta();

	const result = await monta.render(
		'<p>${ foo.bar.baz }</p>',
		{ foo: { bar: { baz: 'qux' } } },
	);
	expect(result).toBe('<p>qux</p>');
});
