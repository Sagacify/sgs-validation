var _ = require('underscore');

module.exports = (function () {
	'use strict';

	return {

		'isUndefined': _.isUndefined,

		'isFunction': _.isFunction,

		'isBoolean': _.isBoolean,

		'isObject': _.isObject,

		'isNumber': _.isNumber,

		'isString': _.isString,

		'isBuffer': _.isBuffer,

		'isRegExp': _.isRegExp,

		'isError': _.isError,

		'isArray': _.isArray,

		'isDate': _.isDate,

		'isNull': _.isNull

	};
})();
