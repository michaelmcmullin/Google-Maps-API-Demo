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
    watch: {
      css: {
        files: '**/*.scss',
    		tasks: ['sass', 'cssmin']
      }
    }
	});
	grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['sass', 'cssmin']);
}