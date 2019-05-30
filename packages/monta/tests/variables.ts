import { render } from '../src';

test('string', async () => {
	expect(render('<p>${ foo }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
});

test('number', async () => {
	expect(render('<p>${ foo }</p>', { foo: 42 })).resolves.toBe('<p>42</p>');
});

test('multiple variables', async () => {
	expect(render('<p>${ foo }, ${ bar }, ${ baz }</p>', { foo: 'one', bar: 'two', baz: 3 })).resolves.toBe('<p>one, two, 3</p>');
});

test('path', async () => {
	expect(render('<p>${ foo.bar }</p>', { foo: { bar: 'baz' } })).resolves.toBe('<p>baz</p>');
});

test('deep path', async () => {
	expect(render('<p>${ foo.bar.baz }</p>', { foo: { bar: { baz: 'qux' } } })).resolves.toBe('<p>qux</p>');
});
