# Monta

Yet another template language for Node.

Project status: **experimental / early development**

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

### Example
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

## Why Monta
I used [this](https://mrsharpoblunto.github.io/foswig.js/) to find a 
name for the project, and Monta was the first name that I didn't hate 
and that wasn't taken on npm. So that's what I named it.
