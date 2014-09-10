fs = require('fs')

module.exports = {
  d3js: ((req,res)->
    url = 'd3js/' + req.param('demo')

    if fs.existsSync('views/' + url + '.ejs')
      files = {}
      files.ejs = fs.readFileSync('views/d3js/' + req.param('demo') + '.ejs', { encoding: 'utf8' })
      files.coffee = fs.readFileSync('assets/js/d3js/' + req.param('demo') + \
        '.coffee', { encoding: 'utf8' })
      
      stylePath = 'assets/styles/d3js/' + '_' + req.param('demo') + '.styl'
      if fs.existsSync(stylePath)
        files.stylus = fs.readFileSync(stylePath, { encoding: 'utf8' })
      else
        files.stylus = false

      if /d3js-utils/.test(files.ejs)
        files.d3utils = fs.readFileSync('assets/js/d3js-utils.coffee', { encoding: 'utf8' })
      else
        files.d3utils = false

      res.view url, {layout: 'layouts/demo-layout', files: files}
    
    else res.notFound()
  )
}