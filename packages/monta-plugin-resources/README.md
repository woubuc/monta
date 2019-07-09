# Resources plugin for Monta
Resource system and pipeline for [Monta](https://www.npmjs.com/package/monta)

### Plugin status: experimental
Not ready for use yet, missing major features.

## Why
The resource plugin is the foundation for loading and processing static 
assets, like stylesheets, script files and images.
 
This plugin is primarily designed for use with static site generators 
(SSG's) and pre-rendered pages. Because the plugin processes the 
resource files on each `render()` call, it's not very well suited for
real-time rendering. This may be improved upon later, but it's currently 
not the main focus of this plugin.

## How
Install Monta and the plugin into your project's dependencies
```
yarn add monta monta-plugin-resources
```

Use in your templates
```html
<html>
  <head>
    <!-- Bundle files with static urls -->
    <link rel="stylesheet" href="${ get('stylesheet.css') | toUrl() }">
    
    <!-- Or inline them -->
    <style type="text/css">
      ${ get('stylesheet.css') | inline() }
    </style>
  </head>
  
  <body>
    <!-- Works for images too -->
    <img src="${ get('image.png') | toUrl() }">
    
    <!-- Most image types will automatically be inlined as base64 -->
    <img src="${ get('image.png') | inline() }">
  </body>
</html>
```

### Syntax
```html
<!-- Get a file -->
${ get('path/to/file.css') }

<!-- Save to a static file and return the URL -->
<link href="${ get('style.css') | toUrl() }">
<img src="${ get('image.jpg') | toUrl() }">

<!-- Return the file as a base64-encoded string -->
<style>${ get('style.css') | inline() }</style>
<img src="${ get('...') | inline() }">

<!-- Loop over multiple files --> 
${ get('*.css') | foreach(): }
  <link href="${ this | toUrl() ">
${ :end }

${ get('*.(png|jpg)') | foreach(): }
  <img src="${ this | toUrl() ">
${ :end }
```
