const valueParser = require('postcss-value-parser');
const oneColor = require('onecolor');

const visited = Symbol('visited');


// SVG
function createSVG(filterElements) {

	var xmlns = 'http://www.w3.org/2000/svg';
	var svg = '<svg xmlns="' + xmlns + '">';

	var svgFilter = '<filter id="filter">';

	for(var i = 0; i < filterElements.length; i++) {
		svgFilter += filterElements[i];
	}

	svgFilter += '</filter>';

	svg += svgFilter;
	svg += '</svg>';

	return svg;
}
function createSVGElement(tagname, attributes, subElements) {
	var elem = '<' + tagname;
	for(var key in attributes) {
		elem += ' ' + key + '="' + attributes[key] + '"';
	}
	if(subElements !== undefined) {
		elem += '>';
		for(var i = 0; i < subElements.length; i++) {
			elem += subElements[i];
		}
		elem += '</' + tagname + '>';
	} else {
		elem += ' />';
	}
	return elem;
}

function validateArg1(args) {
	if(args.length === 1 && args[0].length === 1) {
		return Array.from(args);
	}

	throw new Error('Invalid arguments');
}

function parseUnitNumber(value) {
	const result = valueParser.unit(value);
	return [parseFloat(result.number), result.unit];
}
const helpers = {

	length: function(amount, unit) {
		switch(unit) {
			case 'px':
				break;
			case 'em':
			case 'rem':
				amount *= 16;
				break;
		}
		return amount;
	},

	angle: function(amount, unit) {
		switch(unit) {
			case 'deg':
				break;
			case 'grad':
				amount = 180 * amount / 200;
				break;
			case 'rad':
				amount = 180 * amount / Math.PI;
				break;
			case 'turn':
				amount = 360 * amount;
				break;
		}
		return amount;
	}

};

const filters = {
	// Grayscale
	grayscale: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('Invalid value for grayscale filter');

		amount = amount || 0;

		if(unit) {
			amount /= 100;
		}

		var properties = {};

		// CSS
		properties.filtersCSS = ['grayscale(' + amount + ')'];

		// SVG
		var svg = createSVGElement('feColorMatrix', {
			type: 'matrix',
			'color-interpolation-filters': 'sRGB',
			values: (0.2126 + 0.7874 * (1 - amount)) + ' ' +
				(0.7152 - 0.7152 * (1 - amount)) + ' ' +
				(0.0722 - 0.0722 * (1 - amount)) + ' 0 0 ' +
				(0.2126 - 0.2126 * (1 - amount)) + ' ' +
				(0.7152 + 0.2848 * (1 - amount)) + ' ' +
				(0.0722 - 0.0722 * (1 - amount)) + ' 0 0 ' +
				(0.2126 - 0.2126 * (1 - amount)) + ' ' +
				(0.7152 - 0.7152 * (1 - amount)) + ' ' +
				(0.0722 + 0.9278 * (1 - amount)) + ' 0 0 0 0 0 1 0'
		});
		properties.filtersSVG = [svg];

		// IE
		properties.filtersIE = amount >= 0.5 ? ['gray'] : [];

		return properties;
	},

	// Sepia
	sepia: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('Invalid value for sepia filter');

		amount = amount || 0;

		if(unit) {
			amount /= 100;
		}

		var properties = {};

		// CSS
		properties.filtersCSS = ['sepia(' + amount + ')'];

		// SVG
		var svg = createSVGElement('feColorMatrix', {
			type: 'matrix',
			'color-interpolation-filters': 'sRGB',
			values: (0.393 + 0.607 * (1 - amount)) + ' ' +
				(0.769 - 0.769 * (1 - amount)) + ' ' +
				(0.189 - 0.189 * (1 - amount)) + ' 0 0 ' +
				(0.349 - 0.349 * (1 - amount)) + ' ' +
				(0.686 + 0.314 * (1 - amount)) + ' ' +
				(0.168 - 0.168 * (1 - amount)) + ' 0 0 ' +
				(0.272 - 0.272 * (1 - amount)) + ' ' +
				(0.534 - 0.534 * (1 - amount)) + ' ' +
				(0.131 + 0.869 * (1 - amount)) + ' 0 0 0 0 0 1 0'
		});
		properties.filtersSVG = [svg];

		// IE
		properties.filtersIE = amount >= 0.5 ? ['gray', 'progid:DXImageTransform.Microsoft.Light()'] : [];

		return properties;
	},

	// Saturate
	saturate: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('Invalid value for saturate filter');

		amount = amount || 1;

		var properties = {};

		if(unit) {
			amount /= 100;
		}

		// CSS
		properties.filtersCSS = ['saturate(' + amount + ')'];

		// SVG
		var svg = createSVGElement('feColorMatrix', {
			type: 'matrix',
			'color-interpolation-filters': 'sRGB',
			values: (0.213 + 0.787 * (amount)) + ' ' +
				(0.715 - 0.715 * (amount)) + ' ' +
				(0.072 - 0.072 * (amount)) + ' 0 0 ' +
				(0.213 - 0.213 * (amount)) + ' ' +
				(0.715 + 0.295 * (amount)) + ' ' +
				(0.072 - 0.072 * (amount)) + ' 0 0 ' +
				(0.213 - 0.213 * (amount)) + ' ' +
				(0.715 - 0.715 * (amount)) + ' ' +
				(0.072 + 0.928 * (amount)) + ' 0 0 0 0 0 1 0'
		});
		properties.filtersSVG = [svg];

		// IE
		// no filter

		return properties;
	},

	// Hue-rotate
	'hue-rotate': function([value]) {
		validateArg1(arguments);
		let [angle, unit] = parseUnitNumber(value);
		if(!['deg', 'grad', 'rad', 'turn'].includes(unit)) throw new Error('Invalid unit for hue-rotate');
		if(angle < 0) throw new Error('hue-rotate cannot be negative');

		angle = angle || 0;

		angle = helpers.angle(angle, unit);

		var properties = {};

		// CSS
		properties.filtersCSS = ['hue-rotate(' + angle + 'deg)'];

		// SVG
		var svg = createSVGElement('feColorMatrix', {
			type: 'hueRotate',
			'color-interpolation-filters': 'sRGB',
			values: angle
		});
		properties.filtersSVG = [svg];

		// IE
		// no filter

		return properties;
	},

	// Invert
	invert: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('invert cannot be negative');

		amount = amount || 0;

		if(unit) {
			amount /= 100;
		}

		var properties = {};

		// CSS
		properties.filtersCSS = ['invert(' + amount + ')'];

		// SVG
		var svgSub1 = createSVGElement('feFuncR', {
			type: 'table',
			tableValues: amount + ' ' + (1 - amount)
		});
		var svgSub2 = createSVGElement('feFuncG', {
			type: 'table',
			tableValues: amount + ' ' + (1 - amount)
		});
		var svgSub3 = createSVGElement('feFuncB', {
			type: 'table',
			tableValues: amount + ' ' + (1 - amount)
		});
		var svg = createSVGElement('feComponentTransfer', {
			'color-interpolation-filters': 'sRGB'
		}, [svgSub1, svgSub2, svgSub3]);
		properties.filtersSVG = [svg];

		// IE
		properties.filtersIE = amount >= 0.5 ? ['invert'] : [];

		return properties;
	},

	// Opacity
	opacity: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('invert cannot be negative');

		amount = amount || 1;

		var properties = {};

		if(unit) {
			amount /= 100;
		}

		// CSS
		properties.filtersCSS = ['opacity(' + amount + ')'];

		// SVG
		var svgSub1 = createSVGElement('feFuncA', {
			type: 'table',
			tableValues: '0 ' + amount
		});
		var svg = createSVGElement('feComponentTransfer', {
			'color-interpolation-filters': 'sRGB'
		}, [svgSub1]);
		properties.filtersSVG = [svg];

		// IE
		// no filter

		return properties;
	},

	// Brightness
	brightness: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('brightness cannot be negative');

		amount = amount || 1;

		if(unit) {
			amount /= 100;
		}

		var properties = {};

		// CSS
		properties.filtersCSS = ['brightness(' + amount + ')'];

		// SVG
		var svgSub1 = createSVGElement('feFuncR', {
			type: 'linear',
			slope: amount
		});
		var svgSub2 = createSVGElement('feFuncG', {
			type: 'linear',
			slope: amount
		});
		var svgSub3 = createSVGElement('feFuncB', {
			type: 'linear',
			slope: amount
		});
		var svg = createSVGElement('feComponentTransfer', {
			'color-interpolation-filters': 'sRGB'
		}, [svgSub1, svgSub2, svgSub3]);
		properties.filtersSVG = [svg];

		// IE
		properties.filtersIE = ['progid:DXImageTransform.Microsoft.Light()'];

		return properties;
	},

	// Contrast
	contrast: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('contrast cannot be negative');

		amount = amount || 1;

		if(unit) {
			amount /= 100;
		}

		var properties = {};

		// CSS
		properties.filtersCSS = ['contrast(' + amount + ')'];

		// SVG
		var svgSub1 = createSVGElement('feFuncR', {
			type: 'linear',
			slope: amount,
			intercept: -(0.5 * amount) + 0.5
		});
		var svgSub2 = createSVGElement('feFuncG', {
			type: 'linear',
			slope: amount,
			intercept: -(0.5 * amount) + 0.5
		});
		var svgSub3 = createSVGElement('feFuncB', {
			type: 'linear',
			slope: amount,
			intercept: -(0.5 * amount) + 0.5
		});
		var svg = createSVGElement('feComponentTransfer', {
			'color-interpolation-filters': 'sRGB'
		}, [svgSub1, svgSub2, svgSub3]);
		properties.filtersSVG = [svg];

		// IE
		// no filter

		return properties;
	},

	// Blur
	blur: function([value]) {
		validateArg1(arguments);
		let [amount, unit] = parseUnitNumber(value);
		if(amount < 0) throw new Error('blur cannot be negative');
		if(!unit && amount !== 0) throw new Error('blur unit error');

		amount = amount || 0;

		var properties = {};

		amount = helpers.length(amount, unit);

		// CSS
		properties.filtersCSS = ['blur(' + amount + 'px)'];

		// SVG
		var svg = createSVGElement('feGaussianBlur', {
			stdDeviation: amount
		});
		properties.filtersSVG = [svg];

		// IE
		properties.filtersIE = ['progid:DXImageTransform.Microsoft.Blur(pixelradius=' + amount + ')'];

		return properties;
	},

	// Drop Shadow
	'drop-shadow': function(args) {
		let [offsetX, unitX] = parseUnitNumber(args[0]);
		let [offsetY, unitY] = parseUnitNumber(args[1]);
		let [radius, unitRadius] = parseUnitNumber(args[2]);
		let spread, unitSpread, color;
		if(args.length <= 4) {
			color = args[3];
		} else {
			[spread, unitSpread] = parseUnitNumber(args[3]);
			color = args[4];
		}
		offsetX = Math.round(offsetX) || 0;
		offsetY = Math.round(offsetY) || 0;
		radius = Math.round(radius) || 0;
		color = color || '#000000';

		var properties = {};

		if((unitX === ' ' && offsetX !== 0) || (unitY === ' ' && offsetY !== 0) || (unitRadius === ' ' && radius !== 0) || spread) {
			return properties;
		}

		offsetX = helpers.length(offsetX, unitX);
		offsetY = helpers.length(offsetY, unitY);
		radius = helpers.length(radius, unitRadius);

		// CSS
		properties.filtersCSS = ['drop-shadow(' + offsetX + 'px ' + offsetY + 'px ' + radius + 'px ' + color + ')'];

		// SVG
		var svg1 = createSVGElement('feGaussianBlur', {
			'in': 'SourceAlpha',
			stdDeviation: radius
		});
		var svg2 = createSVGElement('feOffset', {
			dx: offsetX + 1,
			dy: offsetY + 1,
			result: 'offsetblur'
		});
		var svg3 = createSVGElement('feFlood', {
			'flood-color': oneColor(color).cssa()
		});
		var svg4 = createSVGElement('feComposite', {
			in2: 'offsetblur',
			operator: 'in'
		});
		var svg5Sub1 = createSVGElement('feMergeNode', {});
		var svg5Sub2 = createSVGElement('feMergeNode', {
			'in': 'SourceGraphic'
		});
		var svg5 = createSVGElement('feMerge', {}, [svg5Sub1, svg5Sub2]);
		properties.filtersSVG = [svg1, svg2, svg3, svg4, svg5];

		// IE
		properties.filtersIE = ['progid:DXImageTransform.Microsoft.Glow(color=' + color + ',strength=0)', 'progid:DXImageTransform.Microsoft.Shadow(color=' + color + ',strength=0)'];

		return properties;
	}
};

module.exports = function(opts = {}) {
	const { oldIE, svg, webkit, strict, skipIfDuplicated = true } = opts;
	return {
		postcssPlugin: 'postcss-filter-fallback',
		Declaration(decl, { Declaration, result }) {
			// ignore nodes we already visited
			if(decl[visited]) {
				return;
			}
			if(decl.prop != 'filter') {
				return;
			}
			decl[visited] = true;
			if(skipIfDuplicated !== false && decl.parent.nodes.filter((node) => node.type === 'decl' && (node.prop == 'filter' || node.prop == '-webkit-filter')).length > 1) {
				return;
			}

			let changed = false;
			let parsedValue = valueParser(decl.value);

			let none = false;
			let properties = {
				filtersCSS: [],
				filtersSVG: [],
				filtersIE: []
			};
			parsedValue.nodes.forEach((node) => {
				if(node.type === 'function') {
					const filterName = node.value.toLowerCase();
					const fn = filters[filterName];
					if(!fn) {
						properties.filtersCSS.push(decl.value.slice(node.sourceIndex, node.sourceEndIndex));
						return;
					}

					const args = [];
					if(node.nodes.length > 0) {
						let arg = [];
						node.nodes.forEach((node, index) => {
							if(node.type === 'divider') {
								args.push(arg);
								arg = [];
							} else if(node.type !== 'space') {
								arg.push(decl.value.slice(node.sourceIndex, node.sourceEndIndex));
							}
						});
						args.push(arg);
					}
					try {
						let currentProperties = fn.apply(this, args);
						for(let j in currentProperties) {
							if(currentProperties[j]) {
								properties[j] = properties[j].concat(currentProperties[j]);
							}
						}
						changed = true;
					} catch(e) {
						if(strict === true) {
							throw e;
						} else if(strict !== false) {
							result.warn('Unexpect Filter', { node: decl, word: decl.value });
						}
					}
				} else if(node.type === 'word') {
					if(node.value.toLowerCase() === 'none') {
						none = true;
					}
				}
			});
			if(none) {
				decl.value = 'none';
			} else if(changed) {
				// Add IE filter compatibility
				if(oldIE && properties.filtersIE?.length) {
					const newDecl = new Declaration({
						prop: 'filter',
						value: properties.filtersIE.join(" ")
					});
					newDecl[visited] = true;
					decl.parent.insertBefore(decl, newDecl);
				}

				// Add SVG filter support
				if(svg && properties.filtersSVG?.length) {
					const svgString = createSVG(properties.filtersSVG);
					const filtersSVG = "url('data:image/svg+xml;charset=utf-8," + svgString + "#filter')";
					const newDecl = new Declaration({
						prop: 'filter',
						value: filtersSVG
					});
					newDecl[visited] = true;
					decl.parent.insertBefore(decl, newDecl);
				}

				// Add Webkit prefix
				if(webkit && properties.filtersCSS?.length) {
					const newDecl = decl.cloneBefore({ prop: '-webkit-filter', value: properties.filtersCSS.join(" ") });
					newDecl[visited] = true;
				}
			}
		}
	};
};
module.exports.postcss = true;
