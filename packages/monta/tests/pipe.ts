import { compile } from '../src';

test('single pipe', async () => {
	const template = await compile('<p>${ foo | trim() }</p>');
	const result = await template.render({ foo: '   test  ' });
	expect(result).toEqual('<p>test</p>');
});

test('multiple pipe', async () => {
	const template = await compile('<p>${ foo | trim() | upper() }</p>');
	const result = await template.render({ foo: '   test  ' });
	expect(result).toEqual('<p>TEST</p>');
});
