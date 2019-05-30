import { render } from '../../src';

test('trim', async () => {
	expect(render('<p>${ foo | trim() }</p>', { foo: '   bar  ' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | trim() }</p>', { foo: 'bar  ' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | trim() }</p>', { foo: '   bar' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | trim() }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
});

test('upper', async () => {
	expect(render('<p>${ foo | upper() }</p>', { foo: 'bar' })).resolves.toBe('<p>BAR</p>');
	expect(render('<p>${ foo | upper() }</p>', { foo: 'BaR' })).resolves.toBe('<p>BAR</p>');
	expect(render('<p>${ foo | upper() }</p>', { foo: 'BAR' })).resolves.toBe('<p>BAR</p>');
});

test('lower', async () => {
	expect(render('<p>${ foo | lower() }</p>', { foo: 'BAR' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | lower() }</p>', { foo: 'BaR' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | lower() }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
});

test('padLeft', async () => {
	expect(render('<p>${ foo | padLeft(5) }</p>', { foo: 'bar' })).resolves.toBe('<p>  bar</p>');
	expect(render('<p>${ foo | padLeft(3) }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | padLeft(1) }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
});

test('padRight', async () => {
	expect(render('<p>${ foo | padRight(5) }</p>', { foo: 'bar' })).resolves.toBe('<p>bar  </p>');
	expect(render('<p>${ foo | padRight(3) }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
	expect(render('<p>${ foo | padRight(1) }</p>', { foo: 'bar' })).resolves.toBe('<p>bar</p>');
});
