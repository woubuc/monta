import Monta from '../src';

/* These tests determines if the pipe syntax works.
 * They are not meant to test every pipeable function
 * in Monta, for these tests we should assume all
 * builtin functions work as intended.
 *
 * See the `functions` directory for tests concerning
 * the behaviour of the builtin functions.
 */

test('single pipe', async () => {
	const render = await new Monta().compile('<p>${ foo | trim() }</p>');

	expect(await render({ foo: '  bar '})).toBe('<p>bar</p>');
	expect(await render({ foo: 42 })).toBe('<p>42</p>');
});

test('multiple pipe', async () => {
	const render = await new Monta().compile('<p>${ foo | trim() | upper() }</p>');

	expect(await render({ foo: '  bar '})).toBe('<p>BAR</p>');
	expect(await render({ foo: 42 })).toBe('<p>42</p>');
});
