import minimist from 'minimist';
import path from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import globby from 'globby';
import { compileFile } from '../';

const EXT = ['.mt', '.html'];

export default async function cli(data : object, argv : string[]) {
	const args = minimist(argv);
	if (args._.length === 0) throw new Error('No input files given');

	const outDir = path.resolve((args.out) ? args.out : 'dist');
	await ensureDir(outDir);

	const files = (await globby(args._))
		.filter(f => EXT.includes(path.extname(f)))
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
