module.exports = (config) ->
  config.set
    basePath: ''
    frameworks: ['jasmine']
    files: [
      'assets/vendors/bower/jquery/dist/jquery.min.js'
      'assets/vendors/bower/lodash/dist/lodash.min.js'

      # d3.js
      
      'assets/vendors/bower/d3/d3.min.js'
      'assets/js/d3js-utils.coffee'
      
      'assets/js/d3js/icosahedron.coffee'
      'tests/specs/d3js/icosahedron-spec.coffee'

      # raphael.js
      
      'assets/vendors/bower/raphael/raphael-min.js'

      'assets/js/raphael/bars-3dimensional.coffee'
      'tests/specs/raphael/bars-3dimensional-spec.coffee'
    ]

    exclude: []
    preprocessors: {
      '**/*.coffee': 'coffee'
    }
    coffeePreprocessor: {
      # options passed to the coffee compiler
      options: {
        bare: false
        sourceMap: false
      }
      # transforming the filenames
      transformPath: (path)-> path.replace(/\.coffee$/, '.js')
    }

    reporters: ['dots']

    port: 9876

    colors: true

    logLevel: config.LOG_INFO

    autoWatch: true

    browsers: ['PhantomJS']

    singleRun: false

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher'
      'karma-coffee-preprocessor'
    ]