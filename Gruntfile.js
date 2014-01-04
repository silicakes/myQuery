module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: true,
				compress: true,
				sourceMap: function(path) {
					return path.replace(/\.js/, ".map");
				}
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'demo/js/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				"boss": true,
				"curly": true,
				"eqeqeq": true,
				"eqnull": true,
				"expr": true,
				"immed": true,
				"noarg": true,
				"onevar": true,
				"quotmark": "double",
				"smarttabs": true,
				"trailing": true,
				"undef": true,
				"unused": true
			},
			files: {
				src: 'src/<%= pkg.name %>.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['uglify'], ['jshint']);

};