module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		// Setting folder templates.
		dirs: {
			js: "assets/js",
			css: "assets/css",
		},

		// JavaScript linting with JSHint.
		jshint: {
			options: {
				jshintrc: ".jshintrc",
			},
			all: [
				"Gruntfile.js",
				"!<%= dirs.js %>/admin/*.js",
				"!<%= dirs.js %>/admin/customizer/*.js",
				"!<%= dirs.js %>/admin/*.min.js",
				"!<%= dirs.js %>/admin/customizer/*.min.js",
			],
		},

		// Sass linting with Stylelint.
		stylelint: {
			options: {
				stylelintrc: ".stylelintrc",
			},
			all: ["<%= dirs.css %>/*.scss"],
		},

		// Minify all .js files.
		uglify: {
			options: {
				ie8: true,
				parse: {
					strict: false,
				},
				output: {
					comments: /@license|@preserve|^!/,
				},
			},
			admin: {
				files: [
					{
						expand: true,
						cwd: "<%= dirs.js %>/admin/",
						src: ["*.js", "!*.min.js"],
						dest: "<%= dirs.js %>/admin/",
						ext: ".min.js",
					},
					{
						expand: true,
						cwd: "<%= dirs.js %>/admin/customizer/",
						src: ["*.js", "!*.min.js"],
						dest: "<%= dirs.js %>/admin/customizer/",
						ext: ".min.js",
					},
				],
			},
		},

		// Compile all .scss files.
		sass: {
			options: {
				sourcemap: "none",
				implementation: require("node-sass"),
			},
			compile: {
				files: [
					{
						expand: true,
						cwd: "<%= dirs.css %>/",
						src: ["*.scss"],
						dest: "<%= dirs.css %>/",
						ext: ".css",
					},
				],
			},
		},

		// Generate all RTL .css files
		rtlcss: {
			generate: {
				expand: true,
				cwd: "<%= dirs.css %>",
				src: ["*.css", "!font-awesome.min.css", "!*-rtl.css"],
				dest: "<%= dirs.css %>/",
				ext: "-rtl.css",
			},
		},

		// Minify all .css files.
		cssmin: {
			minify: {
				expand: true,
				cwd: "<%= dirs.css %>/",
				src: ["*.css"],
				dest: "<%= dirs.css %>/",
				ext: ".css",
			},
		},

		// Concatenate select2.css onto the admin.css files.
		concat: {
			admin: {
				files: {
					"<%= dirs.css %>/urcma-admin.css": [
						"<%= dirs.css %>/select2.css",
						"<%= dirs.css %>/urcma-admin.css",
					],
					"<%= dirs.css %>/urcma-admin-rtl.css": [
						"<%= dirs.css %>/select2.css",
						"<%= dirs.css %>/urcma-admin-rtl.css",
					],
				},
			},
		},

		// Watch changes for assets.
		watch: {
			css: {
				files: ["<%= dirs.css %>/*.scss"],
				tasks: ["sass", "rtlcss", "postcss", "cssmin", "concat"],
			},
			js: {
				files: [
					"<%= dirs.js %>/admin/*js",
					"!<%= dirs.js %>/admin/*.min.js",
				],
				tasks: ["jshint", "uglify"],
			},
		},

		// PHP Code Sniffer.
		phpcs: {
			options: {
				bin: "vendor/bin/phpcs",
				standard: "./phpcs.ruleset.xml",
			},
			dist: {
				src: [
					"**/*.php", // Include all files
					"!node_modules/**", // Exclude node_modules/
					"!vendor/**", // Exclude vendor/
				],
			},
		},

		// Autoprefixer.
		postcss: {
			options: {
				processors: [
					require("autoprefixer")({
						overrideBrowserslist: ["> 0.1%", "ie 8", "ie 9"],
					}),
				],
			},
			dist: {
				src: ["<%= dirs.css %>/*.css"],
			},
		},

		// Compress files and folders.
		compress: {
			options: {
				archive: "user-registration-customize-my-account.zip",
			},
			files: {
				src: [
					"**",
					"!.*",
					"!*.md",
					"!*.zip",
					"!.*/**",
					"!sass/**",
					"!vendor/**",
					"!Gruntfile.js",
					"!package.json",
					"!composer.json",
					"!composer.lock",
					"!node_modules/**",
					"!phpcs.ruleset.xml",
				],
				dest: "user-registration-customize-my-account",
				expand: true,
			},
		},
	});

	// Load NPM tasks to be used here
	grunt.loadNpmTasks("grunt-sass");
	grunt.loadNpmTasks("grunt-phpcs");
	grunt.loadNpmTasks("grunt-rtlcss");
	grunt.loadNpmTasks("grunt-postcss");
	grunt.loadNpmTasks("grunt-stylelint");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compress");

	// Register tasks
	grunt.registerTask("default", ["uglify"]);

	grunt.registerTask("js", ["default"]);

	grunt.registerTask("css", ["sass", "rtlcss", "postcss", "cssmin"]);

	// Only an alias to 'default' task.
	grunt.registerTask("dev", ["default"]);

	grunt.registerTask("zip", ["dev", "compress"]);
};
