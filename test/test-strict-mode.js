var Validator = require('../src/validator');

var assert = require('assert');

module.exports = function () {
	'use strict';

	before('initialize and configure', function () {
		Validator.configure({
			options: {
				typeStrict: true,
				formatStrict: true,
				existenceStrict: true,
				nullAsExistence: true,
				undefinedAsExistence: false
			}
		});
	});

	it('non existant key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty', {
						lenEquals: 10
					}]
				}
			}
		}, {}), false);
	});

	it('non existant key with existenceStrict config set to false', function () {
		Validator.configure({
			options: {
				existenceStrict: false
			}
		});

		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty', {
						lenEquals: 10
					}]
				}
			}
		}, {}), true);

		Validator.configure({
			options: {
				existenceStrict: true
			}
		});
	});

	it('wrong type value', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty', {
						lenEquals: 10
					}]
				}
			}
		}, {
			a: 1
		}), false);
	});

	it('wrong type value typeStrict config set to false', function () {
		Validator.configure({
			options: {
				typeStrict: false
			}
		});

		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String'
				}
			}
		}, {
			a: 1
		}), true);

		Validator.configure({
			options: {
				typeStrict: true
			}
		});
	});

	it('value with wrong format', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty', {
						lenEquals: 10
					}]
				}
			}
		}, {
			a: '01234567890'
		}), false);
	});

	it('value with wrong format formatStrict config set to false', function () {
		Validator.configure({
			options: {
				formatStrict: false
			}
		});

		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty', {
						lenEquals: 10
					}]
				}
			}
		}, {
			a: '01234567890'
		}), true);

		Validator.configure({
			options: {
				formatStrict: true
			}
		});
	});
};
