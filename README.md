# Monta

Yet another template language for Node.

Project status: **experimental / early development**

[![npm](https://img.shields.io/npm/v/monta.svg)](https://www.npmjs.com/package/monta)
[![license](https://img.shields.io/github/license/woubuc/monta.svg)](https://github.com/woubuc/monta/blob/master/LICENSE.txt)
[![Build Status](https://img.shields.io/travis/woubuc/monta.svg)](https://travis-ci.org/woubuc/monta)
[![Coverage Status](https://img.shields.io/coveralls/github/woubuc/monta.svg)](https://coveralls.io/github/woubuc/monta?branch=master)
[![David](https://img.shields.io/david/woubuc/monta.svg)](https://david-dm.org/woubuc/monta)

## Why
- Not indentation-based
- Uses JS-like syntax
- Inheritance (extends & blocks)
- Templates are HTML

## How
Install the package in your project:
```
npm install monta
```

Create a template file:
```html
<!-- my-template.mt -->
<p>${ foo }</p>
```

Compile the template:
```javascript
const { compileFile } = require('monta');

const template = await compileFile('my-template.mt');
```

Render your page:
```javascript
const result = await template.render({ foo: 'bar' });

console.log(result); // <p>bar</p>
```

### Use with Express
```javascript
const express = require('express');

const app = express();
app.engine('mt', require('monta').express);

app.get('/', (req, res) => {
    res.render('my-template.mt', { foo: 'bar' });
});
```

## Syntax
Monta templates are basically just HTML files. You can use any file
extension you like, but all project code and examples will use the 
`.mt` extension.

```html
<!-- Print a variable -->
${ myVar }

<!-- Extend a base template file (must be the first thing in a file) -->
${ extends('otherTemplate.mt') }

<!-- Define a block -->
${ define('blockName') }

<!-- Define a block with default content -->
${ define('blockName'): }
  <p>Default content</p>
${ :end }

<!-- Use a block -->
${ block('blockName'): }
  <p>Block content</p>
${ :end }

<!-- Include another template file (in-place) -->
${ include('otherTemplate.mt') }
```

## CLI
You can use the Monta CLI to compile one or more template files.

```
npm install --global monta-cli

monta templates/**/*
```
This will compile all `.mt` and `.html` files in the templates/ 
directory and subdirectories, and place the rendered html files in the
default output directory dist/

The CLI will skip over any files starting with an underscore. You can
use this to avoid compiling base templates that your other pages extend
from.

### Output
You can define a different output directory by providing the `--out`
argument.
```
monta templates/**/* --out ./my-out-dir
```

### Extensions
By default, the CLI looks for `.mt` and `.html` files. If you want to
use a different file extension, you can specify it with the `--ext`
argument.

```
monta templates/**/* --ext .myext

monta templates/**/* --ext .mt,.html,.myext
```
 

### Data
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

## Example
`base.mt`:
```html
<html>
  <head>
    ${ define('head'): }
      <title>Monta Example</title>
    ${ :end }
  </head>
<body>
  <main>
    ${ define('body') }
  </main>

  <footer>Copyright ${ year }</footer>
</body>
</html>
```

`page.mt`:
```html
${ extends('base.html') }

${ block('head'): }
  <title>Monta Page</title>
${ :end }

${ body('body'): }
  <p>Welcome to my site, ${ name }</p>
${ :end }
```

`app.js`:
```javascript
const { compileFile } = require('monta');

(async function main() {
  const template = await compileFile('page.mt');
  const result = await template.render({
    name: 'woubuc',
    year: 2019,
  });

  console.log(result);
})();
```

Output:
```html
<html>
  <head>
    <title>Monta Page</title>
  </head>
<body>
  <main>
    <p>Welcome to my site, woubuc</p>
  </main>

  <footer>Copyright 2019</footer>
</body>
</html>
```

## Why Monta
Uninspired as I was, I used 
[this](https://mrsharpoblunto.github.io/foswig.js/) to find a name for 
the project, and Monta was the first name that I didn't hate _and_ that
wasn't taken on npm.

There is no further meaning to the name.
