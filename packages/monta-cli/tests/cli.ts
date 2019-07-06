import tmp from 'tmp-promise';
import path from 'path';
import { readdir, readFile } from 'fs-extra';
import { cli } from '../src/cli';

// Paths using backslashes (on Windows) need to be converted to forward slashes
const dirname = () : string => __dirname.replace(/(\\)/g, '/');

test('cli', async () => {
	jest.setTimeout(10000);

	const dir = await tmp.dir({ unsafeCleanup: true });
	await cli({}, [dirname() + '/*', '--out', dir.path, '--root', dirname()]);

	const files = await readdir(dir.path);
	expect(files).toHaveLength(2);
	expect(files).toContain('foo.html');
	expect(files).toContain('bar.html');

	const foo = (await readFile(path.join(dir.path, 'foo.html'))).toString();
	expect(foo).toBe('<html>\n<body>\n	<p>undefined</p>\n</body>\n</html>');

	const bar = (await readFile(path.join(dir.path, 'bar.html'))).toString();
	expect(bar).toBe('<html>\n<body>\n	<p>Bar</p>\n</body>\n</html>');

	await dir.cleanup();
});

test('with input', async () => {
	jest.setTimeout(10000);

	const dir = await tmp.dir({ unsafeCleanup: true });
	await cli({ foo: 'Foo' }, [dirname() + '/*', '--out', dir.path, '--root', dirname()]);

	const files = await readdir(dir.path);
	expect(files).toContain('foo.html');

	const foo = (await readFile(path.join(dir.path, 'foo.html'))).toString();
	expect(foo).toBe('<html>\n<body>\n	<p>Foo</p>\n</body>\n</html>');

	await dir.cleanup();
});
