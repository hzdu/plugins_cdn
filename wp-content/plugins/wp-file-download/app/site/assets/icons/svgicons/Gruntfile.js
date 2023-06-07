module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    svgstore: {
      options: {
        prefix : 'wpfd-', // This will prefix each <g> ID
        svg: {
          xmlns: 'http://www.w3.org/2000/svg',
          // style: 'display: none;'
        },
        includeTitleElement: false
      },
      default : {
        files: {
          'wpfd-svgs.svg': ['svgs/*.svg'],
        }
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-svgstore');

  // Default task(s).
  grunt.registerTask('default', ['svgstore']);

};
