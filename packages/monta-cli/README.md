# Monta CLI
Command-line tool to compile
[Monta templates](https://www.npmjs.com/package/monta) into HTML files.

[![npm](https://img.shields.io/npm/v/monta-cli.svg)](https://www.npmjs.com/package/monta-cli)
[![license](https://img.shields.io/github/license/woubuc/monta.svg)](https://github.com/woubuc/monta/blob/master/LICENSE.txt)
[![Build Status](https://img.shields.io/travis/woubuc/monta.svg)](https://travis-ci.org/woubuc/monta)
[![Codecov](https://img.shields.io/codecov/c/gh/woubuc/monta.svg)](https://codecov.io/gh/woubuc/monta)
[![David](https://img.shields.io/david/woubuc/monta.svg?path=packages%2Fmonta-cli)](https://david-dm.org/woubuc/monta?path=packages%2Fmonta-cli)

## Usage
```
npm install --global monta-cli

monta templates/**/*
```
This will compile all template files (`*.mt` or `*.html`) in the 
`templates/` directory and subdirectories, and place the rendered html
files in the default output directory `dist/`

The CLI will skip over any files starting with an underscore (e.g. 
`_base.mt`). You can use this to avoid compiling base templates that
your other pages extend from.

**Note**: Monta CLI uses fast-glob 3, which expects forward slashes `/`
on all operating systems, including Windows. Backslashes `\` are used 
for escaping characters. See the [fast-glob pattern syntax](https://github.com/mrmlnc/fast-glob#pattern-syntax) 
for more information.

## Template Data
You can pipe a JSON object into Monta CLI, and it will be used as the 
template data in your templates.

```html
<p>${ foo }</p>
```

```
echo {"foo":"bar"} | monta templates/foo.mt
```

Will result in:

```html
<p>bar</p>
```

## Root
Set the template root directory by providing the `--root` argument.
If omitted, Monta CLI will use the current working directory to
resolve file paths.

```
monta views/**/*.mt --root ./views
```

## Output Directory
You can define a different output directory by providing the `--out`
argument.

```
monta templates/**/* --out ./my-out-dir
```

## Extensions
By default, the CLI looks for `.mt` and `.html` files. If you want to
use a different file extension, you can specify it with the `--ext`
argument.

```
monta templates/**/* --ext .myext

monta templates/**/* --ext .mt,.html,.myext
```
 
