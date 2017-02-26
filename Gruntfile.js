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
          'src/imports.ts',
          'src/globals.ts',
          'src/map-styles.ts',
          'src/main.ts',
          'src/listings.ts',
          'src/search-zoom.ts',
          'src/search-time.ts',
          'src/search-places.ts',
          'src/drawing-tools.ts',
          'src/directions-panel.ts',
          'src/transport-layers.ts'
          ],
        dest: 'tmp/maps.ts',
      },
    },
    ts: {
      default:{
        src: [
          'src/imports.ts',
          'src/utilities.ts',
          'src/globals.ts',
          'src/map-styles.ts',
          'src/main.ts',
          'src/listings.ts',
          'src/search-zoom.ts',
          'src/search-time.ts',
          'src/search-places.ts',
          'src/drawing-tools.ts',
          'src/directions-panel.ts',
          'src/transport-layers.ts'
        ],
        reference: 'src/imports.ts',
        out: 'js/maps.js'
      },
      options: {
          module: 'amd', //or commonjs 
          target: 'es5' //or es3 
      }
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
  grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'cssmin', 'ts']);
}