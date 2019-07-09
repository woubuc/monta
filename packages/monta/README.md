# Monta

Yet another template language for Node.

[![npm](https://img.shields.io/npm/v/monta.svg)](https://www.npmjs.com/package/monta)
[![license](https://img.shields.io/github/license/woubuc/monta.svg)](https://github.com/woubuc/monta/blob/master/LICENSE.txt)
[![Build Status](https://img.shields.io/travis/woubuc/monta.svg)](https://travis-ci.org/woubuc/monta)
[![Codecov](https://img.shields.io/codecov/c/gh/woubuc/monta.svg)](https://codecov.io/gh/woubuc/monta)
[![David](https://img.shields.io/david/woubuc/monta.svg?path=packages%2Fmonta)](https://david-dm.org/woubuc/monta?path=packages%2Fmonta)

### Project status: early development
Not recommended for production, but should be okay for testing and 
playing around with. The basics work but expect bugs and frequent 
updates.

## Why
- Not indentation-based
- Inheritance (extends & blocks)
- Pipe syntax
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
const Monta = require('monta');

const monta = new Monta();

const render = await monta.compileFile('my-template.mt');
```

Render your page:
```javascript
const result = await render({ foo: 'bar' });

console.log(result); // <p>bar</p>
```

Or do both in one go:
```javascript
const result = await monta.renderFile('my-template.mt', { foo: 'bar' });

console.log(result); // <p>bar</p>
```

You can also compile and render plain code:
```javascript
monta.compile('<p>${ foo }</p>');
monta.render('<p>${ foo }</p>', { foo: 'bar' });
```

### Use with Express
```javascript
const express = require('express');
const Monta = require('monta');

const monta = new Monta({ templateRoot: './views' });

const app = express();
app.engine('mt', monta.express);

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

<!-- Array iteration -->
${ myArr | foreach(): }
  <!-- Use ${ this } or ${ . } for the top-level 
       object or variable in the current scope -->
  <p>${ this }</p>
${ :end }

<!-- Control flow -->
${ myVar | eq("foo"): }
  <p>Variable is "foo"</p>
${ :end }

${ myVar | eq("foo"): }
  <p>Variable is "foo"</p>
${ :else: }
  <p>Variable is not "foo"</p>
${ :end }

<!-- All control flow functions -->
${ myVar | eq("foo"): } <!-- Equal (strict) -->
${ myVar | neq("foo"): } <!-- Not equal (strict) -->
${ myVar | lt("foo"): } <!-- Less than -->
${ myVar | gt("foo"): } <!-- Greater than -->

<!-- Checks if a value exists in an array, or a key in an object -->
${ myVar | has("foo"): }

<!-- String operations -->
${ myVar | trim() }
${ myVar | upper() }
${ myVar | lower() }
${ myVar | padLeft(6) }
${ myVar | padRight(6) }
```

## CLI
See the [monta-cli](https://www.npmjs.com/package/monta-cli) package.

## Example
`views/base.mt`:
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

`views/page.mt`:
```html
${ extends('base.html') }

${ block('head'): }
  <title>Monta Page</title>
${ :end }

${ body('body'): }
  <p>Welcome to my site, ${ name | upper() }</p>
${ :end }
```

`app.js`:
```javascript
const Monta = require('monta');

const monta = new Monta({ templateRoot: './views' });

(async function main() {
  const result = await monta.renderFile('page.mt', {
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
    <p>Welcome to my site, WOUBUC</p>
  </main>

  <footer>Copyright 2019</footer>
</body>
</html>
```

## Why's it called Monta?
Uninspired as I was, I used 
[this](https://mrsharpoblunto.github.io/foswig.js/) to find a name for 
the project, and Monta was the first name that I didn't hate _and_ that
wasn't taken on npm.

There is no further meaning to the name.
