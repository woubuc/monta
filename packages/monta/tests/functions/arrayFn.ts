import Monta from '../../src';

test('sort', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ sort(arr) }</p>');

	expect(await render({ arr: [2, 1, 3] })).toBe('<p>123</p>');
	expect(await render({ arr: ['c', 'd', 'b', 'e', 'a'] })).toBe('<p>abcde</p>');
	expect(await render({ arr: ['foo-b', 'foo-a'] })).toBe('<p>foo-afoo-b</p>');
});

test('sort (pipe)', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>${ arr | sort() }</p>');

	expect(await render({ arr: [2, 1, 3] })).toBe('<p>123</p>');
});

test('filter', async () => {
	const monta = new Monta();

	const render = await monta.compile(`<p>\${ filter(arr, 'foo*') }</p>`);

	expect(await render({ arr: ['foo', 'foobar', 'bar', 'baz'] })).toBe('<p>foofoobar</p>');
	expect(await render({ arr: ['foo', 'barfoo', 'bar', 'baz'] })).toBe('<p>foo</p>');
});

test('filter (pipe)', async () => {
	const monta = new Monta();

	const render = await monta.compile(`<p>\${ arr | filter('foo*') }</p>`);

	expect(await render({ arr: ['foo', 'foobar', 'bar', 'baz'] })).toBe('<p>foofoobar</p>');
});
