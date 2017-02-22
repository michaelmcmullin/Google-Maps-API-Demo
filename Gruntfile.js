module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
      options: {
        outputStyle: "nested",
        sourceMap: true
      },
			dist: {
				files: {
					'css/styles.css' : 'sass/main.scss'
				}
			}
		},
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },
    concat: {
      dist: {
        src: [
          'src/globals.js',
          'src/map-styles.js',
          'src/main.js',
          'src/listings.js',
          'src/search-zoom.js',
          'src/search-time.js',
          'src/search-places.js',
          'src/drawing-tools.js',
          'src/directions-panel.js',
          'src/transport-layers.js'
          ],
        dest: 'js/maps.js',
      },
    },
    watch: {
      css: {
        files: '**/*.scss',
    		tasks: ['sass', 'cssmin']
      }
    }
	});
	grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'cssmin', 'concat']);
}