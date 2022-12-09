# Vite plugin which can import modules asynchronously from CDN.

This plugin is forked from [vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import) and allows you to specify modules to be loaded in **defer/async** mode in addition.

# Installation

npm:

```
npm install vite-plugin-cdn-import-async --save-dev
```

yarn:

```
yarn add  vite-plugin-cdn-import-async -D
```

# Usage

## Plugin config

Specify `mode` param whthin configs of the module you want to import asynchronously from CDN:

```js
// vite.config.js
import cdnImport from 'vite-plugin-cdn-import-async'

export default {
    plugins: [
        cdnImport({
            modules: [
                {
                    name: 'react',
                    var: 'React',
                    mode: 'async', // 'async' atrribute will be added to its <script> tag.
                    path: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`,
                },
                {
                    name: 'lottie-web',
                    var: 'lottie',
                    mode: 'defer', // 'defer' atrribute will be added to its <script> tag.
                    path: `https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
                },
                {
                    name: 'axios',  // Module without 'mode' param will be loaded synchronously.
                    var: 'axios',
                    path: 'https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js',
                }
            ],
        }),
    ],
}
```

This demo will generate codes below into the output file:

```html
<script>function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];</script>
<script async onload="__cdnImportAsyncHandler('React')" onerror="__cdnImportAsyncHandler('React', true)" src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
<script defer onload="__cdnImportAsyncHandler('lottie')" onerror="__cdnImportAsyncHandler('lottie', true)" src="https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js"></script>
```

## Input file

By default, every module that defined in plugin config will generate its `<script>` tag into the output file, no matter this module was used in the project or not.

But now you can set attribute `data-cdn-import` in `<meta>` tag of the input file, to determind which module should generate `<script>` into the output file.

For example (`example/react/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" data-cdn-import="React,lottie" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

According to `data-cdn-import="React,lottie"`, plugin will only handle `React` and `lottie` modules and generate their `<script>` into the output file (`example/react/dist/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example</title>
    <script>function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];</script>
    <script async onload="__cdnImportAsyncHandler('React')" onerror="__cdnImportAsyncHandler('React', true)" src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script defer onload="__cdnImportAsyncHandler('lottie')" onerror="__cdnImportAsyncHandler('lottie', true)" src="https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js"></script>
    <script type="module" crossorigin src="/assets/index.c9473e27.js"></script>
    <link rel="stylesheet" href="/assets/index.cd9c0392.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
### Mode suffix

Using suffix `@async` or `@defer` within `data-cdn-import` can also generate asynchronous `<script>` tag of marked module.

**Example**

Notice that here's no `mode: 'async'` in the configs of React module:

```js
// vite.config.js
import cdnImport from 'vite-plugin-cdn-import-async'

export default {
    plugins: [
        cdnImport({
            modules: [
                {
                    name: 'react',
                    var: 'React',
                    path: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`,
                },
                {
                    name: 'lottie-web',
                    var: 'lottie',
                    mode: 'defer', 
                    path: `https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
                },
                {
                    name: 'axios',
                    var: 'axios',
                    path: 'https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js',
                }
            ],
        }),
    ],
}
```

And the input file (`example/react/index.html`) likes:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" data-cdn-import="React@async,lottie" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

According to `React@async` within `data-cdn-import`, the **React** module will generate `<script>` tag with `async` attribute into the output file (`example/react/dist/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example</title>
    <script>function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];</script>
    <script async onload="__cdnImportAsyncHandler('React')" onerror="__cdnImportAsyncHandler('React', true)" src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script defer onload="__cdnImportAsyncHandler('lottie')" onerror="__cdnImportAsyncHandler('lottie', true)" src="https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js"></script>
    <script type="module" crossorigin src="/assets/index.c9473e27.js"></script>
    <link rel="stylesheet" href="/assets/index.cd9c0392.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```


## Other ussages

Other basic ussages see [vite-plugin-cdn-import](https://github.com/MMF-FE/vite-plugin-cdn-import).
