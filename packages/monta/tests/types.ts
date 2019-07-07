import Monta from '../src';

/* These tests verify the correctness of the rendered data
 * and type of variables. They should not focus on testing
 * variable access, as this is done in `variables.ts`.
 */

test('string', async () => {
	const render = await new Monta().compile('<p>${ str }</p>');

	expect(await render({ str: 'bar' })).toBe('<p>bar</p>');
	expect(await render({ str: 'baz' })).toBe('<p>baz</p>');
});

test('number', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ num }</p>');

	expect(await render({ num: 42 })).toBe('<p>42</p>');
	expect(await render({ num: -1 })).toBe('<p>-1</p>');
	expect(await render({ num: Infinity })).toBe('<p>Infinity</p>');
	expect(await render({ num: NaN })).toBe('<p>NaN</p>');

	const type = await monta.compile('<p>${ num | eq(2): }ok${ :end }</p>');
	expect(await type({ num: 2 })).toBe('<p>ok</p>');
});

test('boolean', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ bool }</p>');

	expect(await render({ bool: true })).toBe('<p>true</p>');
	expect(await render({ bool: false })).toBe('<p>false</p>');

	const type = await monta.compile('<p>${ bool | eq(true): }ok${ :end }</p>');
	expect(await type({ bool: true })).toBe('<p>ok</p>');
});

test('array', async () => {
	const render = await new Monta().compile('<p>${ arr }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>123</p>');
	expect(await render({ arr: ['a', 'b', 'c'] })).toBe('<p>abc</p>');
	expect(await render({ arr: ['foo', 'bar', 'baz'] })).toBe('<p>foobarbaz</p>');
	expect(await render({ arr: [1, 'foo', -3] })).toBe('<p>1foo-3</p>');
});

test('object', async () => {
	const render = await new Monta().compile('<p>${ obj }</p>');

	expect(await render({ obj: { foo: 'bar' } })).toBe('<p>[object Object]</p>');
});
