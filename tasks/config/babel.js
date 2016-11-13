module.exports = function(grunt) {

  grunt.config.set('babel', {
    dev: {
      files: [{
        expand: true,
        cwd: 'assets/js/',
        src: ['**/*.js', '!dependencies/**/*.js'],
        dest: '.tmp/public/js/',
        ext: '.js'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-babel');

};
