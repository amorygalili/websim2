var _ = require('lodash'),
	fs = require("fs"),
	simPath = _.trimRight(grunt.option('simPath'), '/');


function isDirectory(path) {

	try {
	    // Query the entry
	    stats = fs.lstatSync(path);

	    // Is it a directory?
	    if (!stats.isDirectory()) {
	       	return false;
	    }
	}
	catch (e) {
	    return false;
	}

	return true;
}

function getModulePaths() {

	// Get the folders containing the modules
	var moduleParentPaths = ['robotpy_websim/html/modules/', simPath + '/modules/'];

	// Get all the module paths
	var modulePaths = {};

	moduleParentPaths.forEach(function(moduleParentPath) {
		var modules = fs.readdirSync(path);
		modules.forEach(function(module) {
			if(isDirectory(moduleParentPath + module)) {
				modulePaths[module] = moduleParentPath + module;
			}
		});
	});

	return modulePaths;
}

module.exports = function(grunt) {

	var modulePaths = getModulePaths();

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
		    options: {
		    	mangle: false
		    },
		    my_target: {
		    	files: {
		        	simPath + 'modules.min.js': _.map(modulePaths, function(path) { return path + 'js/*.js'; })
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
		      		simPath + 'modules.min.css': _.map(modulePaths, function(path) { return path + 'css/*.css'; })
		    	}
		  	}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');


	grunt.registerTask('loadTemplates', 'Generates templates.json from the module html templates', function() {

		// Get all the template paths
		var templatePaths = {};
		modulePaths.forEach(function(path, module) {
			var templatePath = path + '/templates';
			if(isDirectory(templatePath)) {
				templatePaths[module] = templatePath;
			}
		});

		// Get all the template content
		var templateContent = {};
		templatePaths.forEach(function(path, module) {
			templateContent[module] = {};
			var templates = fs.readdirSync(path);
			templates.forEach(function(template) {
				templateContent[module][template] = fs.readFileSync(path + '/' + template);
			});
		});

		// Save the templates in templates.js
		fs.writeFileSync(simPath + 'templates.js', JSON.stringify(templatePaths));


	});
	grunt.registerTask('default',['uglify', 'cssmin', 'loadTemplates']);
}