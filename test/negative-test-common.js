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

	it('one key underloading', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String'
				},
				b: {
					type: 'String'
				}
			}
		}, {
			a: 'hello world'
		}), false);
	});

	it('one key overloading', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String'
				},
				b: {
					type: 'String'
				}
			}
		}, {
			a: 'hello world',
			b: 'world hello',
			c: 'world world'
		}), false);
	});

	it('unexistant parent-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Object',
					keys: {
						b: {
							type: 'Object',
							keys: {
								c: {
									type: 'String'
								}
							}
						}
					}
				}
			}
		}, {
			a: {}
		}), false);
	});

	it('missing-key, nested-key, symetric, multi-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Object',
					keys: {
						b: {
							type: 'Object',
							keys: {
								c: {
									type: 'String'
								},
								d: {
									type: 'String'
								}
							}
						}
					}
				}
			}
		}, {
			a: {
				b: {
					d: 'world hello'
				}
			}
		}), false);
	});

	it('missing-key, nested-key, asymetric, multi-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Object',
					keys: {
						b: {
							type: 'Object',
							keys: {
								c: {
									type: 'String'
								}
							}
						},
						d: {
							type: 'String'
						}
					}
				}
			}
		}, {
			a: {
				b: {},
				d: 'world hello'
			}
		}), false);
	});

	it('missing-key, array, numeric-selector, single-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Array',
					keys: {
						0: {
							type: 'String'
						}
					}
				}
			}
		}, {
			a: []
		}), false);
	});

	it('missing-key, array, numeric-selector, multi-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Array',
					keys: {
						0: {
							type: 'String'
						},
						1: {
							type: 'String'
						}
					}
				}
			}
		}, {
			a: [
				'hello world'
			]
		}), false);
	});

	it('missing-key, array, numeric-selector, multi-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Array',
					keys: {
						0: {
							type: 'String'
						},
						1: {
							type: 'String'
						}
					}
				}
			}
		}, {
			a: [
				undefined,
				'hello world'
			]
		}), false);
	});

	it('missing-key, array, $ wildcard key selector, multi-key', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'Array',
					keys: {
						$: {
							type: 'String'
						}
					}
				}
			}
		}, {
			a: [
				''
			]
		}), true);
	});

	it('type check should fail before format validation is called', function () {
		assert.strictEqual(Validator.validate({
			type: 'Object',
			keys: {
				a: {
					type: 'String',
					formats: ['notEmpty']
				}
			}
		}, {
			a: 1
		}), false);
	});
};
