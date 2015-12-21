var _ = require('lodash');

module.exports = function(grunt) {

	var modulePaths = ['robotpy_websim/html/modules/'],
		simPath = grunt.option('simPath');

	if(simPath) {
		modulePaths.push(_.trimRight(simPath, '/') + '/sim/modules/');
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
		    options: {
		    	mangle: false
		    },
		    my_target: {
		    	files: {
		        	'robotpy_websim/html/js/modules.min.js': [_.map(modulePaths, function(path) { return path + '*/js/*.js'; })]
		      	}
		    }
		},
		cssmin: {
			options: {
		    	shorthandCompacting: false,
		    	roundingPrecision: -1
		  	},
		  	target: {
		    	files: {
		      		'robotpy_websim/html/css/modules.min.css': [_.map(modulePaths, function(path) { return path + '*/css/*.css'; })]
		    	}
		  	}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['uglify', 'cssmin']);
}