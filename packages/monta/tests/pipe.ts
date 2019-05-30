import { render } from '../src';

test('single pipe', () => {
	expect(render('<p>${ foo | trim() }</p>', { foo: '  bar '})).resolves.toBe('<p>bar</p>');
});

test('multiple pipe', async () => {
	expect(render('<p>${ foo | trim() | upper() }</p>', { foo: '  bar '})).resolves.toBe('<p>BAR</p>');
});
