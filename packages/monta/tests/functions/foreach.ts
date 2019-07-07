import Monta from '../../src';

test('foreach', async () => {
	const render = await new Monta().compile('<p>${ foreach(arr): }${ this }${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>123</p>');
	expect(await render({ arr: ['f', 'o', 'o'] })).toBe('<p>foo</p>');
	expect(await render({ arr: [['foo', 'bar'], [1, 2, 3]] })).toBe(`<p>foo,bar1,2,3</p>`);
});

test('foreach (pipe)', async () => {
	const render = await new Monta().compile('<p>${ arr | foreach(): }${ this }${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>123</p>');
});

test('parent scope', async () => {
	const render = await new Monta().compile('<p>${ foreach(arr): }${ $parent.foo }${ :end }</p>');

	expect(await render({ foo: 'bar', arr: [1, 2, 3] })).toBe('<p>barbarbar</p>');
});
