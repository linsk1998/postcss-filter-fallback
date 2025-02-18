// Jest unit tests
// To run tests, run these commands from the project root:
// 1. `npm test`

'use strict';
const fs = require('fs');
const postcss = require('postcss');
const filter = require('../index');

const dirname = 'tests/cases/';

const test = function(name, options) {
	// css
	const css = fs.readFileSync(dirname + name + '.css', 'utf-8');
	let expected;

	if(typeof options !== 'undefined' && options.same) {
		expected = css;
	} else {
		expected = fs.readFileSync(dirname + name + '.out.css', 'utf-8');
	}

	// process
	const processed = postcss(filter(options)).process(css);

	expect(processed.css).toBe(expected);
};

describe('postcss-filter-fallback', function() {

	it('should not add SVG filters when none', function() {
		test('none');
	});

	it('should convert grayscale filters', function() {
		test('grayscale', { svg: true });
	});

	it('should convert sepia filters', function() {
		test('sepia', { svg: true });
	});

	it('should convert saturate filters', function() {
		test('saturate', { svg: true });
	});

	it('should convert hue-rotate filters', function() {
		test('hueRotate', { svg: true });
	});

	it('should convert invert filters', function() {
		test('invert', { svg: true });
	});

	it('should convert opacity filters', function() {
		test('opacity', { svg: true });
	});

	it('should convert brightness filters', function() {
		test('brightness', { svg: true });
	});

	it('should convert contrast filters', function() {
		test('contrast', { svg: true });
	});

	it('should convert blur filters', function() {
		test('blur', { svg: true });
	});

	it('should convert drop-shadow filters', function() {
		test('dropShadow', { svg: true });
	});

	it('should convert multiple filters', function() {
		test('multiple', { svg: true });
	});

	it('should not convert invalid filters', function() {
		test('invalid', { svg: true });
	});

	it('should deal correctly with edge cases', function() {
		test('edge', { svg: true });
	});

	it('should add IE filter when asking', function() {
		test('ie', { oldIE: true, svg: true });
	});

	it('should not add filters if they are already present', function() {
		test('present', { same: true, oldIE: true });
	});

});
