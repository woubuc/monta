import path from 'path';
import globby from 'globby';
import { ensureDir, writeFile } from 'fs-extra';

import { compileFile } from 'monta';
import { parseOptions } from './options';

export async function cli(data : object, argv : string[]) {
	if (argv.includes('-v') || argv.includes('--version')) return;

	if (argv.includes('-h') || argv.includes('--help')) {
		console.log('USAGE:\nmonta <files..> [--out <outDir>] [--ext <extList>]');
		return;
	}

	const options = parseOptions(argv);

	const outDir = path.resolve(options.out);
	await ensureDir(outDir);

	const files = (await globby(options.globs))
		.filter(f => options.extensions.includes(path.extname(f)))
		.filter(f => !path.basename(f).startsWith('_'));
	if (files.length === 0) throw new Error('No input files found');

	const basePath = (() => {
		const parts : string[] = [];

		let basePath = '';
		let i = 0;
		while (true) {
			for (const file of files) {
				const first = file.split('/')[i];
				if (!first || (basePath.length > 0 && first != basePath)) return parts.join('/') + '/';
				basePath = first;
			}

			parts.push(basePath);
			basePath = '';
			i++;
		}
	})();

	const normalisedFiles = files.map(f => f.replace(basePath, ''));

	for (const file of normalisedFiles) {
		const inFile = path.join(basePath, file);
		const outFile = path.join(outDir, path.parse(file).name + '.html');

		const output = await compileFile(inFile);
		await writeFile(outFile, await output.render(data));
	}
}
