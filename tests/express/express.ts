import { express } from '../../src';
import path from 'path';

test('express', (cb) => {
	// noinspection JSIgnoredPromiseFromCall
	express(path.join(__dirname, 'express.mt'), { foo: 'bar' }, (err, result) => {
		expect(err).toBeNull();
		expect(result).toBe('<p>bar</p>');
		cb();
	});
});
