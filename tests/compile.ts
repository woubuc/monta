import { compile, compileFile } from '../src';
import path from 'path';

test('compile', async () => {
	const template = await compile('<p>test</p>');
	expect(template).toBeTruthy();
	expect(template).toHaveProperty('render');
	expect(typeof template.render).toBe('function');

	const output = await template.render();
	expect(typeof output).toBe('string');
	expect(output).toBe('<p>test</p>');
});

test('compile with include', async () => {
	const template = await compile('${ include(\'compile.mt\') }', __dirname);
	expect(template).toBeTruthy();
	expect(template).toHaveProperty('render');
	expect(typeof template.render).toBe('function');

	const output = await template.render();
	expect(typeof output).toBe('string');
	expect(output).toBe('<p>compile</p>');
});

test('compileFile', async () => {
	const template = await compileFile(path.join(__dirname, 'compile.mt'));
	expect(template).toBeTruthy();
	expect(template).toHaveProperty('render');
	expect(typeof template.render).toBe('function');

	const output = await template.render();
	expect(typeof output).toBe('string');
	expect(output).toBe('<p>compile</p>');
});
