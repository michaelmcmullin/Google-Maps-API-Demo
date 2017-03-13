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
    ts: {
      default:{
        src: [
          'src/utilities.ts',
          'src/MarkerWithInfoWindow.ts',
          'src/init.ts',
          'src/main.ts',
          'src/listings.ts',
          'src/search-panel.ts',
          'src/search-zoom.ts',
          'src/search-time.ts',
          'src/search-places.ts',
          'src/drawing-tools.ts',
          'src/directions-panel.ts',
          'src/transport-layers.ts'
        ],
        out: 'js/maps.js'
      },
      options: {
          module: 'amd', //or commonjs 
          target: 'es5' //or es3 
      }
    },
    tslint: {
      options: {
          configuration: "src/tslint.json",
          // If set to true, tslint errors will be reported, but not fail the task 
          // If set to false, tslint errors will be reported, and the task will fail 
          force: false,
          fix: false
      },
      files: {
          src: [
              "src/*.ts"
          ]
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
  grunt.loadNpmTasks("grunt-tslint");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'cssmin', 'ts', 'tslint']);
}