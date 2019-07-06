import tmp from 'tmp-promise';
import { readdir } from 'fs-extra';
import { cli } from '../../src/cli';

// Paths using backslashes (on Windows) need to be converted to forward slashes
const dirname = () : string => __dirname.replace(/(\\)/g, '/');

test('ext', async () => {
	jest.setTimeout(10000);

	const dir = await tmp.dir({ unsafeCleanup: true });
	await cli({}, [dirname() + '/*', '--out', dir.path, '--ext', 'bar', '--root', dirname()]);

	const files = await readdir(dir.path);
	expect(files).toHaveLength(1);
	expect(files).toContain('foo.html');

	await dir.cleanup();
});
