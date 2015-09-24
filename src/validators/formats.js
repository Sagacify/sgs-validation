module.exports = (function () {
	'use strict';

	return {

		lenEquals: function (len, str) {
			return str.length === len;
		},

		notEmpty: function (str) {
			return /^\s*$/.test(str) === false;
		}

	};
})();
