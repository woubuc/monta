import Monta from '../src';

test('compile code', async () => {
	const monta = new Monta();

	const render = await monta.compile('<p>test</p>');
	expect(typeof render).toBe('function');

	const result = await render();
	expect(result).toBe('<p>test</p>');
});

test('compile code with include', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const render = await monta.compile('${ include(\'compile.mt\') }');
	expect(typeof render).toBe('function');

	const result = await render();
	expect(result).toBe('<p>compile</p>');
});

test('compileFile', async () => {
	const monta = new Monta({ templateRoot: __dirname });

	const render = await monta.compileFile('compile.mt');
	expect(typeof render).toBe('function');

	const result = await render();
	expect(result).toBe('<p>compile</p>');
});
