import Monta from 'monta';
import path from 'path';
import { readFile } from 'fs-extra';

export function createMonta() : Monta {
	return new Monta({
		templateRoot: __dirname,

		plugins: { resources: path.join(__dirname, '..', 'src') },

		pluginOptions: {
			resources: {
				publicDir: path.join(__dirname, 'output'),
				baseUrl: '/',
			},
		},
	});
}

export async function read(filename : string, encoding : string = 'utf8') : Promise<string> {
	const buf = await readFile(path.join(__dirname, filename));
	return buf.toString(encoding);
}
