import Monta from '../src';

/* These tests verify the correctness of accessing variables
 * in the current scope. They should not focus on verifying
 * the correct output of said variables since this is done
 * in `types.ts`, although some overlap is inevitable.
 */

test('single variable', async () => {
	const render = await new Monta().compile('<p>${ foo }</p>');

	expect(await render({ foo: 'bar' })).toBe('<p>bar</p>');
});

test('multiple variables', async () => {
	const render = await new Monta().compile('<p>${ foo }, ${ bar }, ${ baz }</p>');

	expect(await render({ foo: 'one', bar: 'two', baz: 3 })).toBe('<p>one, two, 3</p>');
});

test('path', async () => {
	const render = await new Monta().compile('<p>${ foo.bar }</p>');

	expect(await render({ foo: { bar: 'baz' } })).toBe('<p>baz</p>');
});

test('deep path', async () => {
	const render = await new Monta().compile('<p>${ foo.bar.baz }</p>');

	expect(await render({ foo: { bar: { baz: 'qux' } } })).toBe('<p>qux</p>');
});

test('this', async () => {
	const render = await  new Monta().compile('<p>${ this }</p>');

	expect(await render('hello world')).toBe('<p>hello world</p>');
	expect(await render(42)).toBe('<p>42</p>');
});

test('.', async () => {
	const render = await new Monta().compile('<p>${ . }</p>');

	expect(await render('hello world')).toBe('<p>hello world</p>');
	expect(await render(42)).toBe('<p>42</p>');
});
