# Monta

Yet another template language for Node.

Project status: **experimental / early development**

[![npm](https://img.shields.io/npm/v/monta.svg)](https://www.npmjs.com/package/monta)
[![license](https://img.shields.io/github/license/woubuc/monta.svg)](https://github.com/woubuc/monta/blob/master/LICENSE.txt)
[![Build Status](https://img.shields.io/travis/woubuc/monta.svg)](https://travis-ci.org/woubuc/monta)
[![Codecov](https://img.shields.io/codecov/c/gh/woubuc/monta.svg)](https://codecov.io/gh/woubuc/monta)
[![David](https://img.shields.io/david/woubuc/monta.svg?path=packages%2Fmonta)](https://david-dm.org/woubuc/monta?path=packages%2Fmonta)

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
See the [monta-cli](https://www.npmjs.com/package/monta-cli) package.

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
