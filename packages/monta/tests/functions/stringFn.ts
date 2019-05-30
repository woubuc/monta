import { compile } from '../../src';

test('trim', async () => {
	const template = await compile('<p>${ foo | trim() }</p>');
	const result = await template.render({ foo: '   bar  ' });
	expect(result).toEqual('<p>bar</p>');
});

test('upper', async () => {
	const template = await compile('<p>${ foo | upper() }</p>');
	const result = await template.render({ foo: 'bar' });
	expect(result).toEqual('<p>BAR</p>');
});

test('lower', async () => {
	const template = await compile('<p>${ foo | lower() }</p>');
	const result = await template.render({ foo: 'BAR' });
	expect(result).toEqual('<p>bar</p>');
});

test('padLeft', async () => {
	const template = await compile('<p>${ foo | padLeft(5) }</p>');
	const result = await template.render({ foo: 'bar' });
	expect(result).toEqual('<p>  bar</p>');
});

test('padRight', async () => {
	const template = await compile('<p>${ foo | padRight(5) }</p>');
	const result = await template.render({ foo: 'bar' });
	expect(result).toEqual('<p>bar  </p>');
});
