import { compile } from '../src';

test('string', async () => {
	const template = await compile('<p>${ foo }</p>');
	const result = await template.render({ foo: 'test' });
	expect(result).toEqual('<p>test</p>');
});

test('number', async () => {
	const template = await compile('<p>${ foo }</p>');
	expect(template).toBeTruthy();

	const result = await template.render({ foo: 42 });
	expect(result).toEqual('<p>42</p>');
});

test('multiple variables', async () => {
	const template = await compile('<p>${ foo }, ${ bar }, ${ baz }</p>');
	const result = await template.render({ foo: 'one', bar: 'two', baz: 3 });
	expect(result).toEqual('<p>one, two, 3</p>');
});
