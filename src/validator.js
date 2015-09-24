var formatValidators = require('./validators/formats');
var typeValidators = require('./validators/types');

var _ = require('underscore');

module.exports = (function () {
	'use strict';

	function Validator () {}

	Validator.prototype.options = {
		wildcardKey: '$',

		typeStrict: true,
		formatStrict: true,
		existenceStrict: true,

		nullAsExistence: true,
		undefinedAsExistence: false
	};

	Validator.prototype.typeValidators = typeValidators;

	Validator.prototype.formatValidators = formatValidators;

	Validator.prototype.configure = function (config) {
		config = config || {};

		_.extend(this.options, config.options);
		_.extend(this.typeValidators, config.typeValidators);
		_.extend(this.formatValidators, config.formatValidators);
	};

	Validator.prototype.validate = function (schema, object) {
		return this.routeObject(schema, object);
	};

	Validator.prototype.routeObject = function (schema, object) {
		var valid = this.validateValue(schema, object);

		if (
			valid === true && 'keys' in schema && (
				this.typeValidators.isObject(object) ||
				this.typeValidators.isArray(object)
			)
		) {
			valid = this.loopObject(schema.keys, object);
		}

		return valid;
	};

	Validator.prototype.loopObject = function (schema, object) {
		var isArray = this.typeValidators.isArray(object);
		var valid = true;
		var keys = Object.keys(schema);
		var len = keys.length;
		var key;
		var val;

		var diffMissmatch = Math.abs(len - Object.keys(object).length);
		var hasDiffMissmatch = isArray === false && diffMissmatch !== 0;

		while (len-- && valid === true) {
			key = keys[len];
			val = object[key];

			if (isArray === true && key === this.options.wildcardKey) {
				valid = this.loopArray(schema[key], object);
			}
			else if (key in object === false) {
				valid = Boolean(schema[key].optional) || !this.options.existenceStrict;
				diffMissmatch -= Number(valid);
			}
			else if (val === undefined && this.options.undefinedAsExistence === true) {
				valid = true;
			}
			else if (val === null && this.options.nullAsExistence === true) {
				valid = true;
			}
			else if (val === undefined || val === null) {
				valid = Boolean(schema[key].optional);
			}
			else {
				valid = this.routeObject(schema[key], val);
			}
		}

		if (this.typeValidators.isBoolean(valid)) {
			valid = (hasDiffMissmatch === false || diffMissmatch === 0) && valid;
		}

		return valid;
	};

	Validator.prototype.loopArray = function (schema, array) {
		var valid = true;
		var len = array.length;

		while (len-- && valid === true) {
			valid = this.routeObject(schema, array[len]);
		}

		return valid;
	};

	Validator.prototype.validateValue = function (schema, value) {
		var valid = true;

		if ('type' in schema) {
			valid = this.validateType(schema.type, value);
		}
		else if (this.options.typeStrict) {
			throw new Error(
				'Type specification missing for value `' + JSON.stringify(value) + '`.'
			);
		}

		if (valid !== true) {
			return valid;
		}

		if ('formats' in schema) {
			valid = this.validateFormats(schema.formats, value);
		}
		else if (
			this.options.typeStrict && this.options.formatStrict && !(
				schema.type === 'Array' ||
				schema.type === 'Object'
			)
		) {
			throw new Error(
				'Format specification missing for value `' + JSON.stringify(value) + '`.'
			);
		}

		return valid;
	};

	Validator.prototype.validateType = function (type, value) {
		var typeValidator;

		if (this.typeValidators.isFunction(type)) {
			typeValidator = type;
		}
		else if (('is' + type) in this.typeValidators) {
			typeValidator = this.typeValidators['is' + type];
		}
		else if (this.typeValidators.isString(type)) {
			throw new Error(
				'No type validator found for type: `' + JSON.stringify(type) + '`.'
			);
		}
		else {
			throw new TypeError(
				'Type validator specification should be a function or a string.'
			);
		}

		return typeValidator(value) || !this.options.typeStrict;
	};

	Validator.prototype.validateFormats = function (formats, value) {
		var valid = true;
		var len = formats.length;

		while (len-- && valid === true) {
			valid = this.validateFormat(formats[len], value);
		}

		return valid || !this.options.formatStrict;
	};

	Validator.prototype.validateFormat = function (format, value) {
		var formatValidator;

		if (this.typeValidators.isFunction(format)) {
			formatValidator = format;
		}
		else if (format in this.formatValidators) {
			formatValidator = this.formatValidators[format];
		}
		else if (this.typeValidators.isString(format)) {
			throw new Error(
				'No format validator found for format: `' + JSON.stringify(format) + '`.'
			);
		}
		else if (this.typeValidators.isObject(format)) {
			var _format = Object.keys(format)[0];
			return this.validateFormat(_format, [ format[_format], value ]);
		}
		else if (
			!(
				this.typeValidators.isArray(value) ||
				this.typeValidators.isObject(value)
			)
		) {
			throw new TypeError(
				'Type validator specification should be a function, string or a object.'
			);
		}

		if (this.typeValidators.isArray(value) === false) {
			value = [ value ];
		}

		return formatValidator.apply(this.formatValidators, value);
	};

	return new Validator();
})();
