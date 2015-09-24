function GruntTasks (grunt) {
	'use strict';

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					timeout: 2000
				},
				src: [
					'test/test.js'
				]
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', [
		'mochaTest'
	]);
}

module.exports = GruntTasks;
