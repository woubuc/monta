import Monta from '../../src';

test('foreach', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ arr | foreach(): }${ this }${ :end }</p>');

	expect(await render({ arr: [1, 2, 3] })).toBe('<p>123</p>');
	expect(await render({ arr: ['f', 'o', 'o'] })).toBe('<p>foo</p>');
	expect(await render({ arr: ['foo', 'bar', 'baz'] })).toBe('<p>foobarbaz</p>');
	expect(await render({ arr: [['foo', 'bar'], [1, 2, 3]] })).toBe(`<p>foo,bar1,2,3</p>`);
});
