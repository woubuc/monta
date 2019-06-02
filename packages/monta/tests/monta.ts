import Monta from '../src';

/* This tests the documented public API of the Monta class.
 * If changes to the code require changes to existing rules
 * in this test, a new breaking version is likely in order.
 */
test('monta', () => {
	const monta = new Monta();

	expect(monta).toBeTruthy();

	expect(monta).toHaveProperty('compile');
	expect(typeof monta.compile).toBe('function');

	expect(monta).toHaveProperty('compileFile');
	expect(typeof monta.compileFile).toBe('function');

	expect(monta).toHaveProperty('render');
	expect(typeof monta.render).toBe('function');

	expect(monta).toHaveProperty('renderFile');
	expect(typeof monta.renderFile).toBe('function');

	expect(monta).toHaveProperty('express');
	expect(typeof monta.express).toBe('function');
});
