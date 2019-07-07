import Monta from '../../src';

test('json', async () => {
	const render = await new Monta().compile('<p>${ json(obj) }</p>');

	expect(await render({ obj: { foo: 'bar' } })).toBe('<p>{"foo":"bar"}</p>');
	expect(await render({ obj: { foo: { bar: 'baz' } } })).toBe('<p>{"foo":{"bar":"baz"}}</p>');
	expect(await render({ obj: 'foo' })).toBe('<p>"foo"</p>');
});

test('json (pipe)', async () => {
	const render = await new Monta().compile('<p>${ obj | json() }</p>');

	expect(await render({ obj: { foo: 'bar' } })).toBe('<p>{"foo":"bar"}</p>');
});
