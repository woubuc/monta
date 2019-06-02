import Monta from '../../src';
import path from 'path';

test('express', (cb) => {
	const monta = new Monta();

	const file = path.join(__dirname, 'express.mt');
	const data = { foo: 'bar' };

	// noinspection JSIgnoredPromiseFromCall
	monta.express(file, data, (err, result) => {
		expect(err).toBeNull();
		expect(result).toBe('<p>bar</p>');
		cb();
	});
});
