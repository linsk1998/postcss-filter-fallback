# PostCSS Filter Fallback

<img src="https://postcss.org/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">

[![npm version](https://img.shields.io/npm/v/postcss-filter-fallback.svg)](https://www.npmjs.com/package/postcss-filter-fallback)
[![Build Status](https://github.com/linsk1998/postcss-filter-fallback/workflows/CI/badge.svg)](https://github.com/linsk1998/postcss-filter-fallback/actions)
[![License](https://img.shields.io/npm/l/postcss-filter-fallback.svg)](https://github.com/linsk1998/postcss-filter-fallback/blob/main/LICENSE)

`postcss-filter-fallback` is a PostCSS plugin that automatically inserts multiple implementations of CSS `filter` properties to enhance browser compatibility, especially for older browsers.

## Features

**Automatic Fallback Insertion**: It adds fallback filter implementations for different browsers, ensuring consistent visual effects across a wide range of browsers.

**Support for Multiple Filters**: Supports a variety of CSS filter functions including `grayscale`, `sepia`, `saturate`, `hue-rotate`, `invert`, `opacity`, `brightness`, `contrast`, `blur`, and `drop-shadow`.

**Customizable Options**: Offers several options to fine - tune the behavior of the plugin according to your project requirements.

## Installation

Install the plugin using npm:

```
npm install postcss-filter-fallback --save-dev
```

Add it to your PostCSS configuration. If you are using a `postcss.config.js` file, it could look like this:


```javascript
module.exports = {
    plugins: [
        require('postcss-filter-fallback')({
            oldIE: true,
            svg: true,
            webkit: false,
            strict: false,
            skipIfDuplicated: true
        })
    ]
};
```

## Options

`oldIE`**(Boolean)**:

If set to `true`, the plugin will generate filter fallbacks specifically for old Internet Explorer browsers. Defaults to `false`.

`svg`**(Boolean)**:

When `true`, the plugin will use SVG - based filter fallbacks. This can be useful for browsers that have better support for SVG filters. Defaults to `false`.

`webkit`**(Boolean)**:

Enables the generation of WebKit - specific filter prefixes. Set to `true` if you want to support Safari and other WebKit - based browsers. Defaults to `false`.

`strict`**(Boolean)**:

In strict mode. When `true`, error filter gammer will throw. Defaults to `false`.

`skipIfDuplicated`**(Boolean)**:

If set to `true` (default), the plugin will skip generating fallbacks for filters that already have multiple implementations in the CSS. This helps prevent over - writing or adding redundant code.

## Example

Before:

```css
.blur {
	filter: blur(2px);
}
```

After:

```css
.blur {
	filter: progid:DXImageTransform.Microsoft.Blur(pixelradius=2);
	filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feGaussianBlur stdDeviation="2" /></filter></svg>#filter');
	filter: blur(2px);
}
```

## Supported Filters

It converts all 10 CSS shorthand filters:

* grayscale
* sepia
* saturate
* hue-rotate
* invert
* opacity
* brightness
* contrast
* blur
* drop-shadow

Learn [more about CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)

## License

[MIT License](LICENSE) Copyright (c) 2025 [Linsk](https://github.com/linsk1998)

This package is an adaptation of [pleeease-filters](https://github.com/iamvdo/pleeease-filters) MIT © 2014 [Vincent De Oliveira &middot; iamvdo](https://github.com/iamvdo)

pleeease-filters module is an adaptation of [CSS-Filters-Polyfill](https://github.com/Schepp/CSS-Filters-Polyfill). Copyright (c) 2012 - 2013 Christian Schepp Schaefer
