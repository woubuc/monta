# Monta CLI

This is the command-line tool to compile 
[Monta templates](https://github.com/woubuc/monta) into HTML files.

For the compiler module, see the 
[monta](https://www.npmjs.com/package/monta) package.

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
 
