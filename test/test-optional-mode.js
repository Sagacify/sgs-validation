var Validator = require('../src/validator');

var assert = require('assert');

module.exports = function () {
	'use strict';

	before('initialize and configure', function () {
		Validator.configure({
			options: {
				typeStrict: true,
				formatStrict: false,
				existenceStrict: true,
				nullAsExistence: true,
				undefinedAsExistence: false
			}
		});
	});

	it('specified value', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					optional: true
				}
			}
		}, {
			a: 'hello world'
		}), true);
	});

	it('unspecified undefined value', function () {
		Validator.configure({
			options: {
				undefinedAsExistence: false
			}
		});

		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					optional: true
				}
			}
		}, {
			a: undefined
		}), true);
	});

	it('unspecified undefined value', function () {
		Validator.configure({
			options: {
				nullAsExistence: false
			}
		});

		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					optional: true
				}
			}
		}, {
			a: undefined
		}), true);
	});

	it('unspecified key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					optional: true
				}
			}
		}, {}), true);
	});

	it('nested, unspecified parent key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Object',
					optional: true,
					value: {
						b: {
							type: 'String'
						}
					}
				}
			}
		}, {}), true);
	});
};
